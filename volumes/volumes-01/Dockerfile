FROM node:current-alpine3.22
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 80

VOLUME /app/feedback

CMD ["node", "server.js"]
