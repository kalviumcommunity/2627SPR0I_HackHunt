# Base image is pinned to an exact Node and Alpine version; never use latest.
# See docs/dependency-pinning.md for upgrade steps.
FROM node:20.20.2-alpine3.23 AS runtime

WORKDIR /app

# Install dependencies first so Docker can cache this layer
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the app source
COPY . .

# Port comes from config. 5000 is only the default.
ENV PORT=5000
EXPOSE 5000

# Run as the built-in non-root user
USER node

CMD ["npm", "start"]
