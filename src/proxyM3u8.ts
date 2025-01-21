import { DEFAULT_HEADERS, M3U8_PROXY_PATH, TS_PROXY_PATH, URL_REGEX } from './constants';
import { fetch } from 'bun';
import { removeNotAllowedHeaders } from './utils';

/**
 * Proxies an M3U8 file by fetching it from the given URL and modifying its content.
 *
 * @param url - The URL of the original M3U8 file.
 * @param customUrl - The custom URL to replace in the M3U8 file.
 * @param customHeaders - Optional custom headers to include in the fetch request.
 * @returns An object containing the modified M3U8 content and the original response object,
 *          or an error message if the fetch operation fails.
 *
 * @throws {Error} If the fetch operation fails.
 */
export default async function proxyM3U8(url: string, customUrl: string, customHeaders: HeadersInit = {}) {
    try {
        const res = await fetch(url, { headers: { ...DEFAULT_HEADERS, ...customHeaders } });
        if (!res.ok) throw new Error('Failed to fetch the m3u8 file');
        const text = await res.text();
        removeNotAllowedHeaders(res.headers);
        const customM3u8 = proxyM3U8Text(text, url, customUrl, customHeaders);
        return { m3u8: customM3u8, res };
    } catch (e: unknown) {
        console.error(e);
        return {
            error: typeof e === 'string' ? e : e instanceof Error ? e.message : 'Failed to fetch the m3u8 file!'
        };
    }
}

/**
 * Modifies an M3U8 text to replace the URLs and headers with proxied ones.
 * @param text the M3U8 text to modify
 * @param url the original URL of the M3U8 file
 * @param customUrl the custom URL to use for the proxy
 * @param customHeaders the custom headers to use for the proxy
 * @returns the modified M3U8 text
 */
export function proxyM3U8Text(text: string, url: string, customUrl: string, customHeaders: HeadersInit = {}) {
    const m3u8 = text
        .split('\n')
        .filter((line) => !line.startsWith('#EXT-X-MEDIA:TYPE=AUDIO') && line !== '')
        .join('\n');
    const encodedCustomHeaders = encodeURIComponent(JSON.stringify(customHeaders));
    const lines = m3u8.split('\n');
    const newLines = [];
    const urlPath = m3u8.includes('RESOLUTION=') ? M3U8_PROXY_PATH : TS_PROXY_PATH;

    const SUBTITLES = '#EXT-X-MEDIA:TYPE=SUBTITLES';
    const KEY = '#EXT-X-KEY';

    for (const line of lines) {
        if (line.startsWith(SUBTITLES) || line.startsWith(KEY)) {
            const uri = URL_REGEX.exec(line)?.[1] ?? '';
            const proxiedUrl = new URL(customUrl + (line.startsWith(SUBTITLES) ? M3U8_PROXY_PATH : TS_PROXY_PATH));
            const fullUri = uri.startsWith('http') ? uri : new URL(uri, url).toString();
            proxiedUrl.searchParams.set('url', encodeURIComponent(fullUri));
            proxiedUrl.searchParams.set('headers', encodedCustomHeaders);
            newLines.push(line.replace(uri, proxiedUrl.toString()));
            continue;
        }

        if (line.startsWith('#')) {
            newLines.push(line);
            continue;
        }

        const originalUrl = new URL(line, url);
        const proxiedUrl = new URL(customUrl + urlPath);
        proxiedUrl.searchParams.set('url', originalUrl.toString());
        proxiedUrl.searchParams.set('headers', encodedCustomHeaders);
        newLines.push(proxiedUrl.toString());
    }

    return newLines.join('\n');
}
