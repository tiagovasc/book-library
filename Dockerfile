FROM node:22-alpine
WORKDIR /app
COPY package.json server.mjs index.html ./
COPY covers ./covers
ENV NODE_ENV=production
USER node
CMD ["node", "server.mjs"]
