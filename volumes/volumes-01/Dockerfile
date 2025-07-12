FROM node:current-alpine3.22
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 80

# Conserver la persistance du dossier /app/feedback sur l'hôte
VOLUME /app/feedback

CMD ["node", "server.js"]
