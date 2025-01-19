import { corsHeaders, notAllowedHeaders } from './constants';

export function getPublicUrlFromRequest(request: Request) {
    const url = new URL(
        process.env.PUBLIC_URL || request.url || request.headers.get('Origin') || request.headers.get('Host') || ''
    );
    return url.origin;
}

export function removeNotAllowedHeaders(headers: Headers) {
    notAllowedHeaders.forEach((header) => headers.delete(header));
    return headers;
}

export function setResponseCorsHeaders(res: Response) {
    for (const [key, value] of Object.entries(corsHeaders)) {
        res.headers.set(key, value);
    }
}

export function getFilenameFromUrl(url: string) {
    const split = url.split('/');
    const length = split.length;
    return split[length - 1];
}
