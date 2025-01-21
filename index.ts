import Bun from 'bun';
import {
    getFilenameFromUrl,
    getOriginUrlFromRequest,
    removeNotAllowedHeaders,
    setResponseCorsHeaders
} from './src/utils';
import proxyM3U8 from './src/proxyM3u8';
import { proxyTs } from './src/proxyTs';
import { IS_ALLOW_ALL_ORIGINS, ALLOWED_ORIGINS, TS_PROXY_PATH, M3U8_PROXY_PATH } from './src/constants';

const server = Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);

        const origin = getOriginUrlFromRequest(req);

        if (!IS_ALLOW_ALL_ORIGINS && !ALLOWED_ORIGINS.includes(origin)) {
            return new Response('Origin not allowed', { status: 403 });
        }

        if (req.method !== 'GET') {
            return new Response('Method not allowed', { status: 405 });
        }

        if (url.pathname === '/') {
            const res = new Response(Bun.file('src/index.html'));
            setResponseCorsHeaders(req, res);
            return res;
        }

        const customHeadersText = url.searchParams.get('headers');
        const customHeaders: HeadersInit = customHeadersText && JSON.parse(decodeURIComponent(customHeadersText));
        let targetUrl = url.searchParams.get('url');
        targetUrl = targetUrl && decodeURIComponent(targetUrl);
        const filename = targetUrl && getFilenameFromUrl(targetUrl);

        if (!targetUrl) return new Response('URL is required', { status: 400 });

        if (url.pathname === M3U8_PROXY_PATH) {
            const data = await proxyM3U8(targetUrl, process.env.PROXY_URL || origin, customHeaders);

            if (data.error || !data.res?.ok) {
                return new Response(data.error, { status: 500 });
            }

            const res = new Response(data.m3u8, {
                headers: {
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Content-Disposition': `inline; filename="${filename}"`
                }
            });
            data.res.headers.forEach((value, key) => res.headers.set(key, value));
            setResponseCorsHeaders(req, res);
            return res;
        }

        if (url.pathname === TS_PROXY_PATH) {
            const tsRes = await proxyTs(targetUrl, customHeaders);
            if (!tsRes.ok) return new Response('Failed to fetch the ts file', { status: 500 });
            removeNotAllowedHeaders(tsRes.headers);
            const res = new Response(tsRes.body, {
                headers: { 'Content-Type': 'video/MP2T', 'Content-Disposition': `inline; filename="${filename}"` }
            });
            tsRes.headers.forEach((value, key) => res.headers.set(key, value));
            setResponseCorsHeaders(req, res);
            return res;
        }

        return new Response('Hello, World!');
    }
});

console.log(`Server running on ${server.hostname}:${server.port}`);
