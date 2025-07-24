## Déploiement multi-containers "Docker"

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
  --env-file ./back/.env \
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

## Déploiement multi-containers "docker-compose"
Ces lignes de configuration dans votre fichier `docker-compose.yml` définissent comment Docker Compose doit construire l'image pour le service backend:

### `build` : Construction de l'Image

#### Context : Le Répertoire de Construction

```yaml
build:
  context: ./back
```

Le paramètre `context` spécifie le **répertoire de construction** (build context) que Docker utilisera pour construire l'image. Dans votre cas :

- `./back` indique que Docker doit utiliser le dossier `back` comme contexte de construction
- Ce répertoire contient le `Dockerfile` et tous les fichiers nécessaires à la construction de l'image

**Pourquoi c'est important :**

- Le contexte définit quels fichiers Docker peut accéder pendant la construction
- Les instructions `COPY` et `ADD` dans le Dockerfile ne peuvent référencer que des fichiers situés dans ce contexte


#### `target` : Étape Cible du Multi-Stage Build

```yaml
target: dev
```

Le paramètre `target` permet de spécifier quelle **étape** (stage) d'un Dockerfile multi-stage vous voulez construire.*
\Dans votre Dockerfile backend :

```dockerfile
FROM node:current-alpine3.22 AS base
# ... instructions communes ...

FROM base AS dev
# ... configuration pour le développement ...

FROM base AS prod
# ... configuration pour la production ...
```

Avec `target: dev`, Docker :

- Construit uniquement l'étape `dev` et ses dépendances (ici `base`)
- **Ignore complètement** l'étape `prod`

**Avantages du target :**

- Construction plus rapide (étapes inutiles ignorées)
- Images adaptées à l'environnement (dev vs prod)
- Dockerfile unique pour plusieurs environnements


### Section Image : Nom et Tag de l'Image

```yaml
image: back-img:dev
```

Le paramètre `image` définit le **nom et le tag** que Docker Compose attribuera à l'image construite

**Sans paramètre `image` :**
Docker Compose génère automatiquement un nom selon le pattern `<projet>_<service>` \
**Avec paramètre `image` :**
Docker Compose utilise exactement le nom spécifié, permettant un contrôle précis du nommage.

### Interaction entre Build et Image

Quand vous utilisez `build` et `image` ensemble dans Docker Compose:

1. **Construction** : Docker construit l'image selon les paramètres `build`
2. **Nommage** : L'image construite reçoit le nom spécifié dans `image`
3. **Réutilisation** : Docker Compose peut réutiliser cette image nommée lors des prochains `up`

### Exemple Pratique

Avec votre configuration :

```yaml
back-app-dev:
  build:
    context: ./back
    target: dev
  image: back-img:dev
```

**Processus de construction :**

1. Docker utilise le répertoire `./back` comme contexte
2. Il trouve le `Dockerfile` dans ce répertoire
3. Il construit uniquement jusqu'à l'étape `AS dev`
4. L'image résultante est nommée `back-img:dev`
5. Le conteneur peut être lancé avec cette image

**Équivalent en ligne de commande :**

```
$ docker build --target dev -t back-img:dev ./back
```

### Commandes pour gérer les environnements Docker Compose

#### développement `profiles dev`
```
# Lance l'environnement:
$ docker compose --profile dev up -d

# Arrête l'environnement:
$ docker compose --profile dev down

# Afficher les logs de tous les services définis dans docker-compose pour le profil "dev"
$ docker compose --profile dev logs -f
# Afficher les logs du seul service "back-app-dev" pour le profil "dev":
$ docker compose --profile dev logs -f back-app-dev

# Construit les images:
$ docker compose --profile dev build
```

#### production `profiles prod`
```
$ docker compose --profile prod up -d
$ docker compose --profile prod down
$ docker compose --profile prod logs -f
$ docker compose --profile prod build
```

#### Nettoie les containers et images inutilisés:
```
$ docker compose down
$ docker system prune -f
```

#### Nettoie tout (containers, volumes, images):
``` 
$ docker compose down -v
$ docker system prune -af
$ docker volume prune -f
```


