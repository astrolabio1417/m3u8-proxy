FROM oven/bun:latest

WORKDIR /src

COPY package.json .
COPY bun.lockb .

RUN bun install
COPY . .

RUN bun run build
EXPOSE 9000

ENTRYPOINT [ "bun", "run", "start" ]
