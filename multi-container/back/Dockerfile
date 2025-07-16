# Etape de base communes
FROM node:current-alpine3.22 AS base
WORKDIR /app
COPY package*.json ./

# Dépendances pour dev/prod
FROM base AS dev
ENV NODE_ENV=development
RUN npm install
COPY . .
VOLUME ["/app/node_modules", "/app/logs"]
EXPOSE 80
CMD ["npm", "run", "dev"]

FROM base AS prod
ENV NODE_ENV=production
RUN npm install --omit=dev
COPY . .
VOLUME ["/app/logs"]
EXPOSE 80
CMD ["npm", "run", "start"]

