# Stage 1: Build
FROM node:20-alpine AS builder
# Updated to latest Alpine version to reduce vulnerabilities

# Upgrade all packages to latest versions to reduce vulnerabilities
RUN apk update && apk upgrade

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache python3 make g++ openssl && npm install -g pnpm

# Copy monorepo files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY tsconfig.base.json ./

COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Install all workspace dependencies (including backend)
RUN pnpm install --frozen-lockfile

# Generate Prisma client and build
WORKDIR /app/apps/backend
RUN npx prisma generate
RUN NODE_OPTIONS='--max-old-space-size=2048' pnpm --filter ./apps/backend build

# Stage 2: Production
FROM node:20-alpine
# Updated to latest Alpine version to reduce vulnerabilities

WORKDIR /app

# Upgrade all packages to latest versions to reduce vulnerabilities
RUN apk update && apk upgrade && apk add --no-cache openssl && npm install -g pnpm && apk cache clean && rm -rf /var/cache/apk/*

# Copy monorepo files for production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY tsconfig.base.json ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy Prisma schema
COPY apps/backend/prisma ./apps/backend/prisma
WORKDIR /app/apps/backend
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/apps/backend/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]