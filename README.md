# M3U8 Proxy Server

To install dependencies:

```bash
bun install | npm install
```

To run:

```bash
bun run dev | npm run dev
```

## Docker

### Build

To build the Docker image:

```bash
docker build -t video-proxy .
```

### Run

To run the Docker container:

```bash
docker run -p 9000:9000 -e PORT=9000 -e PROXY_URL="http://localhost:9000" -e ALLOWED_ORIGINS="http://localhost:9000,http://localhost" video-proxy
```

## Environment Variables

For more information, refer to the `.env.development` file.

-   `PROXY_URL`: The URL of your proxy.
-   `ALLOWED_ORIGINS`: Comma-separated list of allowed origins.
-   `PORT`: The port number.

## Setting Environment Variables

You can find different ways to set up environment variables in the [Bun documentation](https://bun.sh/docs/runtime/env#setting-environment-variables).
