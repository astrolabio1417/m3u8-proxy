import { DEFAULT_HEADERS } from './constants';

export function proxyTs(url: string, customHeaders: HeadersInit = {}) {
    const res = fetch(url, { headers: { ...DEFAULT_HEADERS, ...customHeaders } });
    return res;
}
