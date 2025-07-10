FROM node:current-alpine3.22
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 80
CMD ["node", "server.js"]
