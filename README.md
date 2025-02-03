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

To build the Docker image with vpn:

```bash
docker build -f dockerfile.vpn -t video-proxy-with-vpn .
```

### Run

To run the Docker container:

```bash
docker run -p 9000:9000 -e PORT=9000 -e PROXY_URL="http://localhost:9000" -e ALLOWED_ORIGINS="http://localhost:9000,http://localhost" video-proxy
```

To run the Docker container with vpn:

```bash

docker run -p 9000:9000 \
-e PORT=9000 \
-e PROXY_URL="http://localhost:9000" \
-e ALLOWED_ORIGINS="http://localhost:9000,http://localhost" \
--device-cgroup-rule 'c 10:200 rwm' \
--cap-add MKNOD \
--cap-add AUDIT_WRITE \
--cap-add NET_ADMIN \
--sysctl net.ipv6.conf.all.disable_ipv6=0 \
--sysctl net.ipv4.conf.all.src_valid_mark=1 \
-v ./data:/var/lib/cloudflare-warp \
video-proxy-with-vpn
```

## Environment Variables

For more information, refer to the `.env.development` file.

-   `PROXY_URL`: The URL of your proxy.
-   `ALLOWED_ORIGINS`: Comma-separated list of allowed origins.
-   `PORT`: The port number.

## Setting Environment Variables

You can find different ways to set up environment variables in the [Bun documentation](https://bun.sh/docs/runtime/env#setting-environment-variables).
