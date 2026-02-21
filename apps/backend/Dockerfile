# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ openssl && npm install -g pnpm

# Copy monorepo files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY tsconfig.base.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Generate Prisma client and build
WORKDIR /app/apps/backend
RUN npx prisma generate
RUN NODE_OPTIONS='--max-old-space-size=2048' pnpm build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl && npm install -g pnpm

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
