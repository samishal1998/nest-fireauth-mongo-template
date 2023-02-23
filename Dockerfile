# Get NPM packages
FROM node:18-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./
RUN yarn install

# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile --production

# COPY package.json package-lock.json ./
# RUN npm ci --only=production

# Rebuild the source code only when needed
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN yarn build
# RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/server-docker.js ./server-docker.js
COPY --from=builder /app/mvc ./mvc
COPY --from=builder /app/.env ./.env

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs
EXPOSE 3000

CMD ["yarn", "start:prod"]