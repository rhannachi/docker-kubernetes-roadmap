## Sommaire
* [Résumé des uses cases de l’application](uses_cases.md)

--- 

## Dockerfile

### Première méthode - Connexion d'un container Mongo à un autre container Node.js (déconseillée)

Cette méthode montre comment connecter un container MongoDB à un autre container (par exemple, une application Node.js) en utilisant uniquement les commandes de base Docker. Elle n’est **pas recommandée pour la production**, mais reste utile pour comprendre le fonctionnement réseau de Docker.

#### 1. Télécharger l’image MongoDB

```
# Télécharger l’image officielle MongoDB depuis Docker Hub
$ docker pull mongo
```


#### 2. Inspecter l’image pour connaître le port exposé

```
# Afficher les détails de l’image afin d’identifier le/des port(s) exposé(s)
$ docker image inspect mongo:latest
# Rechercher dans la sortie la partie :
# "ExposedPorts": {
#     "27017/tcp": {}
# }
```

*Le port exposé par défaut est le **27017** (port standard de MongoDB).*

#### 3. Lancer le container MongoDB

```
# Démarrer un container nommé mongo-app en exposant le port 27017
$ docker run -p 27017:27017 --name mongo-app mongo:latest
```


#### 4. Obtenir l’adresse IP du container MongoDB

```
# Récupérer les informations du container pour obtenir son IP interne
$ docker container inspect mongo-app
# Cherchez la ligne :
# "IPAddress": "172.17.0.2"
```

L’adresse IP retournée correspond au réseau interne Docker. C’est l’adresse utilisée par défaut pour joindre MongoDB **uniquement depuis un autre container lancé sur le même réseau**.

#### 5. Configurer l’application Node.js

Dans votre code (`app.js`), mettez à jour l’URL de connexion MongoDB :

- Vous pouvez saisir l’**adresse IP** (`mongodb://172.17.0.2:27017/maBase`)
- Ou, plus simple et recommandé, utilisez directement le **nom du container** :
  `mongodb://mongo-app:27017/maBase`

> Docker va automatiquement résoudre le nom du container (`mongo-app`) vers son IP interne si les containers partagent le même réseau (par défaut, le réseau bridge standard).

#### 6. Builder l’image de l’application Node.js

```
# Construire l’image personnalisée de l’app Node.js depuis le Dockerfile
$ docker build -t node-img .
```


#### 7. Lancer le container Node.js

```
# Lancer le container Node.js en le nommant node-app et exposer le port 3000
$ docker run -p 3000:3000 --name node-app node-img:latest
```

**À retenir :**

- Il faut lancer le container MongoDB avant le container Node.js.
- L'application Node.js pourra se connecter à MongoDB en utilisant l’**IP interne** ou le **nom du container**.
- Cette méthode fonctionne sur un réseau bridge par défaut, mais n’est pas adaptée pour des environnements complexes (utiliser plutôt Docker Compose ou des réseaux personnalisés pour la production).


---

### Deuxième méthode – Connexion recommandée entre un container MongoDB et un container Node.js

Pour une architecture claire et maintenable, il est fortement conseillé d’utiliser un réseau Docker personnalisé afin de permettre à vos containers (Node.js et MongoDB) de communiquer facilement par leur nom.

#### 1. Créer un réseau Docker dédié

Un réseau personnalisé facilite la communication entre containers et offre une meilleure isolation.

```
$ docker network create database-net
```


#### 2. Démarrer le container MongoDB

Téléchargez l’image officielle (si besoin) puis créez le container :

```
$ docker pull mongo
$ docker run -d --network database-net --name mongo-app mongo:latest
```

- L’option `--network database-net` connecte MongoDB au réseau que vous venez de créer.
- L’option `-d` lance le container en arrière-plan.
- mongo-app : Pas besoin d’exposer le port 27017 à l’extérieur du host, car aucune application en dehors de Docker n’a besoin d’y accéder. Seuls les autres containers l’utilisent (ici, node-app).

#### 3. Préparer l’application Node.js

Avant de lancer le container Node.js, configurez l’URL de connexion dans votre fichier `app.js` ou dans vos variables d’environnement :

```
// Exemple d’URL à utiliser dans app.js ou .env
mongodb://mongo-app:27017/nom-de-votre-base
```

- **Astuce :** Utiliser le nom du container (`mongo-app`) dans l’URL permet à Node.js de localiser MongoDB automatiquement grâce au réseau Docker personnalisé.


#### 4. Démarrer le container Node.js

Construisez l’image de votre application puis lancez le container :

```
$ docker build -t node-img .
$ docker run -d -p 3000:3000 --network database-net --name node-app node-img:latest
```

- L’application Node.js pourra alors joindre MongoDB via le nom `mongo-app`.
- `-p 3000:3000` permet d’exposer le service Node.js en local.

#### Récapitulatif : Pourquoi cette méthode ?

- **Communication simplifiée par nom** entre containers (plus besoin de manipuler les adresses IP).
- **Isolation propre** pour les environnements de développement, test ou production.
- **Bonnes pratiques Docker** respectées pour les projets multi-services.