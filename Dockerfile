FROM node:24-alpine AS base
RUN corepack enable pnpm

FROM base AS dependencies
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate
RUN pnpm run build
RUN pnpm prune --prod --no-optional

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache openssl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/src/infrastructure/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/start.sh ./start.sh

RUN chmod +x ./start.sh

USER nodejs

EXPOSE 3000

CMD ["node", "dist/src/main.js"]