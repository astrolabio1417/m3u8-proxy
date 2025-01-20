import { allowAllOrigins, allowedOrigins, notAllowedHeaders } from './constants';

export function getOriginUrlFromRequest(request: Request) {
    let url = request.headers.get('Origin') || request.headers.get('referer') || request.headers.get('host') || '';
    if (url && !url.startsWith('http')) url = `${process.env.SCHEME || 'https'}://${url}`;
    const nUrl = new URL(url);
    return nUrl.origin;
}

export function removeNotAllowedHeaders(headers: Headers) {
    notAllowedHeaders.forEach((header) => headers.delete(header));
    return headers;
}

export function setResponseCorsHeaders(req: Request, res: Response) {
    const origin = getOriginUrlFromRequest(req);
    const corsHeaders = {
        'Access-Control-Allow-Origin': allowAllOrigins
            ? '*'
            : allowedOrigins.includes(origin)
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
