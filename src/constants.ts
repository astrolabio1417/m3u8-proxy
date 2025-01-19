export const notAllowedHeaders = [
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

export const urlRegex = /https?:\/\/[^\""\s]+/g;

export const defaultHeaders = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
};

export const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
export const allowAllOrigins = allowedOrigins.includes('*');
