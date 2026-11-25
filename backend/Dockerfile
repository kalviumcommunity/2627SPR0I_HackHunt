# Keep the Node and Alpine versions pinned; see docs/dependency-pinning.md.
FROM node:20.20.2-alpine3.23 AS node-runtime
RUN apk add --no-cache binutils \
  && strip --strip-unneeded /usr/local/bin/node

FROM node-runtime AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund --cache /tmp/npm-cache \
  && npm cache clean --force --cache /tmp/npm-cache

FROM alpine:3.23.4 AS runtime
RUN apk add --no-cache ca-certificates libgcc libstdc++ \
  && addgroup -S -g 1000 node \
  && adduser -S -u 1000 -G node node

COPY --from=node-runtime /usr/local/bin/node /usr/local/bin/node
COPY --from=node-runtime /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/npm
RUN ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
  && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

WORKDIR /app
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

ENV PORT=5000
EXPOSE 5000

USER node

CMD ["npm", "start"]
