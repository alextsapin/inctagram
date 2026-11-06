
# Stage 1 — install dependencies
FROM node:22.23.4-bookworm-slim AS deps

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable \
    && corepack pnpm install --frozen-lockfile


# Stage 2 — build Next.js
FROM node:22.23.4-bookworm-slim AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public environment variables are set at build time
ARG NEXT_PUBLIC_API_URL=""
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY_CHECKBOX=""
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE=""

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY_CHECKBOX=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY_CHECKBOX
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE

RUN corepack enable \
    && corepack pnpm build


# Stage 3 — production runtime
FROM node:22.23.4-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN mkdir -p .next && chown node:node .next

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]
