import { defaultHeaders } from './constants';

export function proxyTs(url: string, customHeaders: HeadersInit = {}) {
    const res = fetch(url, { headers: { ...defaultHeaders, ...customHeaders } });
    return res;
}
