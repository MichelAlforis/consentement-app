# Stage 1: Build Next.js static export
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve static output with Caddy
FROM caddy:2-alpine
COPY --from=builder /app/out /srv/ouiclair
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
