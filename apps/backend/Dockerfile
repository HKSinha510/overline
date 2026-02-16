FROM node:20-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ openssl

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "dist/main.js"]
