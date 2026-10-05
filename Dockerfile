ARG VERSION=dev

# ---------- BASE ----------
FROM node:22-slim AS base

WORKDIR /usr/src/app

COPY proto ./proto

COPY pnpm-lock.yaml ./
COPY turbo.json ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

COPY services/auth/package*.json ./services/auth/
COPY services/auth/jest.config.js ./services/auth/
COPY services/auth/tsconfig.json ./services/auth/
COPY services/auth/src ./services/auth/src/

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        ca-certificates \
        openssl \
        protobuf-compiler \
        libprotobuf-dev \
        wget \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@11.28.4 --activate


# ---------- DEPS ----------
FROM base AS deps

RUN --mount=type=secret,id=gh_token \
    if [ ! -s /run/secrets/gh_token ]; then \
        echo "ERROR: пустой секрет gh_token - нужен токен GitHub для доступа к приватным репозиториям @shared/*." >&2; \
        echo "       Локально: GH_TOKEN=$(gh auth token) docker build ... ; в CI передаётся GH_PAT." >&2; \
        exit 1; \
    fi; \
    git config --global url."https://x-access-token:$(cat /run/secrets/gh_token)@github.com/".insteadOf "https://github.com/"; \
    git config --global --add url."https://x-access-token:$(cat /run/secrets/gh_token)@github.com/".insteadOf "git@github.com:"; \
    pnpm fetch; \
    rm -f /root/.gitconfig
RUN pnpm install --offline --frozen-lockfile

RUN mkdir -p ./services/auth/src/contracts/proto
RUN pnpm --filter auth proto:generate


RUN pnpm --filter auth prisma:generate

# ---------- DEV ----------
FROM deps AS dev

COPY services/auth/tsconfig.test.json ./services/auth/

ENV NODE_ENV=development

RUN chown -R node:node /usr/src/app

USER node

EXPOSE 50051

CMD ["pnpm", "--filter", "auth", "dev"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1

# ---------- BUILD ----------
FROM deps AS build

ENV NODE_ENV=production


RUN pnpm --filter auth build

RUN pnpm --filter auth deploy /deploy --prod

# ---------- PROD ----------
FROM node:22-slim AS prod

ARG VERSION=dev

ENV APP_VERSION=$VERSION

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        openssl \
        wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /deploy/dist ./dist
COPY --from=build /deploy/node_modules ./node_modules

RUN printf "%s\n" "$VERSION" > VERSION

LABEL org.opencontainers.image.version="$VERSION"

USER node

EXPOSE 50051

CMD ["node", "dist/app.js"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1

# ---------- PREDEPLOY ----------
FROM build AS predeploy

ARG VERSION=dev

ENV APP_VERSION=$VERSION

WORKDIR /usr/src/app

RUN printf "%s\n" "$VERSION" > VERSION

LABEL org.opencontainers.image.version="$VERSION"

WORKDIR /usr/src/app/services/auth

CMD ["pnpm", "--filter", "auth", "migrate:deploy"]
