FROM node:24.4.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret
ENV MONGODB_URL=mongodb

CMD ["npm", "start"]