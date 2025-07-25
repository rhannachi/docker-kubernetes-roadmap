
## Utiliser Docker comme Environnement npm Isolé

Dans cette section, nous montrons comment utiliser Docker pour exécuter des commandes npm (ex : `npm init`, `npm install <package>`, etc.) **sans avoir à installer Node.js sur votre machine locale**.

1. **Construisez l’image :**

```
$ docker build -t node-img .
```

2. **Utilisez l’image pour exécuter des commandes npm dans le dossier courant :**

```
$ docker run -it -v .:/app node-img init
```
Comme nous avons défini `ENTRYPOINT ["npm"]` dans le Dockerfile, il n'est plus nécessaire de taper "npm" devant chaque commande :

- Ici, `init` est interprété comme `npm init`, grâce à l’ENTRYPOINT du Dockerfile.
- Le montage du volume (`-v .:/app`) permet de travailler directement dans votre répertoire local.
- Remplacez `init` par n’importe quelle commande npm, comme `install express` ou `install ping`.

## Utiliser docker-compose comme Environnement npm Isolé
Grâce à notre configuration docker-compose.yml et notre Dockerfile, nous pouvons utiliser Docker Compose pour exécuter des commandes `npm` dans un environnement totalement isolé de la machine hôte.

Ici, l’exécution de commandes npm se fait via la commande `run` de Docker Compose, qui crée à la volée un conteneur temporaire basé sur le service spécifié `npm-app`.
Cela permet d’utiliser npm sans l’installer localement.

```
$ docker compose run npm-app init
$ docker compose run npm-app install ping
$ docker compose run npm-app install express
```