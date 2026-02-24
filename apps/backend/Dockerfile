# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache python3 make g++ openssl && npm install -g pnpm@9

# Copy monorepo config first (for better layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
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

# Prune dev dependencies after build
WORKDIR /app
RUN pnpm prune --prod

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache openssl && rm -rf /var/cache/apk/*

# Copy pruned node_modules from builder (already production-only)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy monorepo config (needed for pnpm resolution)
COPY package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Copy Prisma schema and generated client
COPY apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/node_modules/.prisma ./apps/backend/node_modules/.prisma
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm

# Copy built application from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]