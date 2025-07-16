# Etape de build
FROM node:current-alpine3.22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etape de dev (optionnel)
FROM node:current-alpine3.22 AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
VOLUME ["/app/node_modules"]
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Etape de prod - Nginx
FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build/ .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
