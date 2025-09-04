FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000
VOLUME /app/tasks

CMD [ "node", "tasks-app.js" ]