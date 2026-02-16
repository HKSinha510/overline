# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ openssl

COPY package.json package-lock.json .npmrc ./
RUN npm ci --legacy-peer-deps

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/package.json /app/package-lock.json /app/.npmrc ./
RUN npm ci --legacy-peer-deps --omit=dev

COPY --from=builder /app/prisma ./prisma/
RUN npx prisma generate

COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node -r tsconfig-paths/register dist/main.js"]
