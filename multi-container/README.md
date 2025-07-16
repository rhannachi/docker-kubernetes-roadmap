### Configuration du projet multi-containers (DEV)

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

#### 5. Build et lancement du container backend
```
$ docker build -t back-img ./back
$ docker run --rm -p 3000:80 -v ./back/logs:/app/logs --network database-net --name back-app back-img:latest
```

#### 6. Build et lancement du container frontend
```
$ docker build -t front-img ./front
$ docker run -d --env-file ./front/.env -p 4000:4000 -v ./front:/app --name front-app front-img:latest
```
