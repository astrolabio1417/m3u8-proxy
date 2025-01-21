import { IS_ALLOW_ALL_ORIGINS, ALLOWED_ORIGINS, NOT_ALLOWED_HEADERS } from './constants';

const schemeLength = 'https://'.length;

export function getOriginUrlFromRequest(request: Request) {
    let url = request.headers.get('Origin') || request.headers.get('referer') || request.headers.get('host') || '';

    if (!url.startsWith('http')) {
        const allowedUrl = ALLOWED_ORIGINS.find(
            (origin) => origin.endsWith(url) && origin.length - url.length <= schemeLength
        );
        url = allowedUrl || url;
    }

    const nUrl = new URL(url);
    return nUrl.origin;
}

export function removeNotAllowedHeaders(headers: Headers) {
    NOT_ALLOWED_HEADERS.forEach((header) => headers.delete(header));
    return headers;
}

export function setResponseCorsHeaders(req: Request, res: Response) {
    const origin = getOriginUrlFromRequest(req);
    const corsHeaders = {
        'Access-Control-Allow-Origin': IS_ALLOW_ALL_ORIGINS
            ? '*'
            : ALLOWED_ORIGINS.includes(origin)
            ? origin
            : import.meta.env.ALLOWED_ORIGINS || '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    };

    for (const [key, value] of Object.entries(corsHeaders)) {
        res.headers.set(key, value);
    }
}

export function getFilenameFromUrl(url: string) {
    const split = url.split('/');
    const length = split.length;
    return split[length - 1];
}
