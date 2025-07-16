### Configuration du projet multi-containers

#### 1. Créer un réseau Docker personnalisé
Permet aux containers backend et base de données de communiquer facilement :
```
$ docker network create database-net
```

#### 2. Créer un volume pour la persistance des données MongoDB
Assure la sauvegarde des données même après suppression du container :
```
$ docker volume create mongodb-data
```

#### 3. Récupérer l'image MongoDB officielle
```
$ docker pull mongo
```

#### 4. Lancer MongoDB avec persistance des données
```
$ docker run --rm --network database-net -v mongodb-data:/data/db --name mongo-app mongo:latest
```
du moment qu'on a appelé notre container de base de donnée `mongo-app` il faut modifier `URL_DATABASE` dans le fichier .env du projet back

#### 5. Back (en mode DEV/PROD)
```
$ docker build -f ./back/Dockerfile.dev -t back-img:dev ./back
$ docker build -f ./back/Dockerfile.prod -t back-img ./back
```

lancement du container backend
```
# lancer en mode DEV
$ docker run --rm --env-file ./back/.env -p 3000:80 -v ./back:/app -v ./back/logs:/app/logs --network database-net --name back-app.dev back-img:dev
# lancer en mode PROD
$ docker run --rm --env-file ./back/.env -p 3000:80 -v ./back/logs:/app/logs --network database-net --name back-app back-img
```

#### 7. Front (en mode DEV/PROD)
```
$ docker build -f ./front/Dockerfile.dev -t front-img:dev ./front
$ docker build -f ./front/Dockerfile.prod -t front-img ./front
```

lancement du container frontend en mode DEV et PROD
```
$ docker run --rm --env-file ./front/.env -p 4000:4000 -v ./front:/app --name front-app.dev front-img:dev
$ docker run --rm --env-file ./front/.env -p 80:80 --name front-app front-img
```

