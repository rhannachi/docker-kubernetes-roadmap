FROM node:current-alpine3.22
WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

VOLUME /app/node_modules
VOLUME /app/logs

EXPOSE 80

CMD ["node", "app.js"]

