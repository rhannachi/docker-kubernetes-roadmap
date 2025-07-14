FROM node:current-alpine3.22

# ARG DEFAULT_PORT=80

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# Définit une variable d’environnement PORT avec la valeur 80 à l’intérieur du conteneur.
ENV PORT=80
#ENV PORT=$DEFAULT_PORT
# Indique à Docker que le conteneur écoute sur le port spécifié
EXPOSE $PORT

CMD ["node", "server.js"]
