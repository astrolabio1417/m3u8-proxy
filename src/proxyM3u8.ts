import { defaultHeaders, urlRegex } from './constants';
import { fetch } from 'bun';

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
        const res = await fetch(url, { headers: { ...defaultHeaders, ...customHeaders } });
        if (!res.ok) throw new Error('Failed to fetch the m3u8 file');
        const text = await res.text();
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

    if (m3u8.includes('RESOLUTION=')) {
        for (const line of lines) {
            if (!line.startsWith('#')) {
                const uri = new URL(line, url);
                const updatedM3u8Url = new URL(customUrl + '/m3u8-proxy');
                const subM3u8WithUrl = new URL(uri.href);
                subM3u8WithUrl.searchParams.set('headers', encodedCustomHeaders);
                updatedM3u8Url.searchParams.set('url', subM3u8WithUrl.toString());
                newLines.push(updatedM3u8Url.toString());
                continue;
            }

            if (!line.startsWith('#EXT-X-KEY:')) {
                newLines.push(line);
                continue;
            }

            const updatedTsUrl = new URL(customUrl + '/ts-proxy');
            updatedTsUrl.searchParams.set('url', encodeURIComponent(urlRegex.exec(line)?.[0] ?? ''));
            updatedTsUrl.searchParams.set('headers', encodedCustomHeaders);
            newLines.push(line.replace(urlRegex, updatedTsUrl.toString()));
        }

        return newLines.join('\n');
    }

    for (const line of lines) {
        if (!line.startsWith('#')) {
            const uri = new URL(line, url);
            const updatedTsUrl = new URL(customUrl + '/ts-proxy');
            const tsWithHeadersUrl = new URL(uri.href);
            tsWithHeadersUrl.searchParams.set('headers', encodedCustomHeaders);
            updatedTsUrl.searchParams.set('url', tsWithHeadersUrl.toString());
            newLines.push(updatedTsUrl.toString());
            continue;
        }

        if (!line.startsWith('#EXT-X-KEY:')) {
            newLines.push(line);
            continue;
        }

        const tsUrl = new URL(customUrl);
        tsUrl.searchParams.set('url', encodeURIComponent(urlRegex.exec(line)?.[0] ?? ''));
        tsUrl.searchParams.set('headers', encodedCustomHeaders);
        newLines.push(line.replace(urlRegex, tsUrl.toString()));
        continue;
    }

    return newLines.join('\n');
}
