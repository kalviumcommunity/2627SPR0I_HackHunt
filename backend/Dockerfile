FROM node:20-alpine

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
