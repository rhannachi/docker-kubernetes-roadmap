# Utilise l'image officielle Node.js basée sur Alpine Linux 3.22 (image légère et rapide)
FROM node:current-alpine3.22

# Définit le dossier de travail dans le conteneur ; toutes les commandes suivantes s'exécutent ici
WORKDIR /app

# Copie le fichier package.json dans le conteneur (nécessaire pour installer les dépendances)
COPY package.json .

# Installe les dépendances Node.js listées dans package.json
RUN npm install

# Copie tout le contenu du projet local dans le dossier de travail du conteneur (/app)
COPY . .

# Indique que l'application écoute sur le port 3000 à l'intérieur du conteneur (documentation du port)
EXPOSE 3000

# Définit la commande de démarrage du conteneur : lance Node.js avec le fichier principal app.mjs
ENTRYPOINT ["node", "app.mjs"]
