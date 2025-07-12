FROM node:current-alpine3.22
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 80

# "VOLUME /app/feedback" : Déclare que le contenu du dossier /app/feedback doit être persistant
# "VOLUME /app/node_modules" : Déclare que le contenu du dossier /app/node_modules doit être persistant
# Ces déclarations VOLUME créent des volumes "anonymes" si aucun volume spécifique n'est monté (-v) lors du lancement
VOLUME /app/feedback
VOLUME /app/node_modules

CMD ["npm", "start"]
