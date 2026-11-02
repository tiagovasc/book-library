FROM node:22-alpine
WORKDIR /app
COPY package.json server.mjs index.html favicon.svg favicon.ico apple-touch-icon.png ./
COPY covers ./covers
ENV NODE_ENV=production
USER node
CMD ["node", "server.mjs"]
