### Déploiement d’un projet multi-containers Docker

Ce guide explique comment lancer une stack **MongoDB + Node.js (Back) + React (Front)** de façon claire, maintenable et professionnelle – sans utiliser Docker Compose.

### 1. Création du réseau Docker

Permet aux containers (backend, base de données) de communiquer entre eux grâce à la résolution automatique de leur nom :

```
$ docker network create database-net
```


### 2. Persistance des données MongoDB

Crée un **volume Docker** pour que les données MongoDB survivent à la suppression des containers :

```
$ docker volume create mongodb-data
```


### 3. Préparation et lancement de la base de données MongoDB

Télécharge l’image officielle Mongo et lance le container :

```
$ docker pull mongo

$ docker run \
  --network database-net \
  --name mongo-app \
  -v mongodb-data:/data/db \
  mongo:latest
```

- **Astuce** : utilise le nom `mongo-app` dans l’URL de connexion du backend dans le fichier `.env` du backend.


### 4. Construction et lancement du Backend (Node.js)

#### Construction des images

- DEV : `docker build --target dev -t back-img:dev ./back`
- PROD : `docker build --target prod -t back-img ./back`


#### Lancement des containers

- **DEV** :

```
$ docker run --rm \
  --env-file ./back/.env \
  -p 3000:80 \
  -v ./back:/app \
  -v ./back/logs:/app/logs \
  --network database-net \
  --name back-app.dev \
  back-img:dev
```

- **PROD** :

```
$ docker run --rm \
  --env-file ./back/.env \
  -p 3000:80 \
  -v ./back/logs:/app/logs \
  --network database-net \
  --name back-app \
  back-img
```


### 5. Construction et lancement du Frontend (React)

#### Construction des images

- DEV : `docker build --target dev -t front-img:dev ./front`
- PROD : `docker build --target prod -t front-img ./front`

#### Lancement des containers

- **DEV** :

```
$ docker run --rm \
  --env-file ./front/.env \
  -p 4000:4000 \
  -v ./front:/app \
  --name front-app.dev \
  front-img:dev
```

- **PROD** :

```
$ docker run --rm \
  --env-file ./front/.env \
  -p 80:80 \
  --name front-app \
  front-img
```

