# M3U8 Proxy Server

M3U8 Proxy Server!

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Envs

More info can be found in '.env' file

-   `PROXY_URL`: link of your proxy url (default http://localhost:9000)
-   `ALLOWED_ORIGINS`: origins you want to allow. separated with comma (default `http://localhost:9000,http://localhost`)
-   `PORT`: port number (default `9000`)
