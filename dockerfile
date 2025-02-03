# Use an appropriate base image
FROM caomingjun/warp

USER root

# Set environment variables
ENV WARP_SLEEP=2

# Install dependencies and Bun
RUN apt-get update && apt-get install -y curl unzip \
    && curl -fsSL https://bun.sh/install | bash -s "bun-v1.2.1" \
    && apt-get clean

# Ensure Bun is in PATH
ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /src

COPY package.json .
COPY bun.lockb .
RUN bun install
COPY . .

RUN bun run build

EXPOSE 9000

# ENTRYPOINT ["/bin/sh", "-c", "export PATH=/usr/bin/bun:$PATH && bun run dev"]

# Set the entrypoint
ENTRYPOINT ["/bin/sh", "-c", "bun run dev & /entrypoint.sh"]
