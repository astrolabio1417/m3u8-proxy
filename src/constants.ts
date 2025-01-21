export const NOT_ALLOWED_HEADERS = [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Max-Age',
    'Access-Control-Allow-Credentials',
    'Access-Control-Expose-Headers',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'Origin',
    'Vary',
    'Referer',
    'Server',
    'x-cache',
    'via',
    'x-amz-cf-pop',
    'x-amz-cf-id',
    'date',
    'content-encoding'
];

export const URL_REGEX = /URI=\"(.*)\"/;

export const DEFAULT_HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
};

export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];
export const IS_ALLOW_ALL_ORIGINS = ALLOWED_ORIGINS.includes('*');

export const M3U8_PROXY_PATH = '/m3u8-proxy';
export const TS_PROXY_PATH = '/ts-proxy';
