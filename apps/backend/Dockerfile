# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache python3 make g++ openssl && npm install -g pnpm@9

# Copy monorepo config first (for better layer caching)
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy full source
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Generate Prisma client and build
WORKDIR /app/apps/backend
RUN npx prisma generate
RUN NODE_OPTIONS='--max-old-space-size=2048' pnpm build

# Verify build output exists
RUN ls -la dist/main.js

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache openssl && npm install -g pnpm@9 && rm -rf /var/cache/apk/*

# Copy entire built workspace from builder (includes node_modules, dist, prisma client)
COPY --from=builder /app ./

WORKDIR /app/apps/backend

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node -r tsconfig-paths/register dist/main.js"]