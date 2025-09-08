FROM node:14-alpine

WORKDIR /app
RUN apk --no-cache add curl

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "auth-app.js" ]