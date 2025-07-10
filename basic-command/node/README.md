### Build image Docker
Construit une image Docker à partir du Dockerfile du dossier courant et lui donne le nom (tag) node-img.
```
$ docker build -t node-img .
```
### Afficher la liste des images Docker
```
$ docker image ls
```
### `run` - Lancer un conteneur à partir d'une image
- **`-d`** : Lance le conteneur en **arrière-plan** (mode détaché)
- **`-p 4000:80`** : **Redirige** le port 4000 de votre machine vers le port 80 du conteneur
- **`--name  node-app`** : **Nomme** le conteneur ` node-app`
- **`node-img:latest`** : Utilise l'**image** `node-img` version `latest`

```
$ docker run -d -p 4000:80 --name  node-app node-img:latest
```

L’option --rm dans la commande docker run sert à supprimer automatiquement le conteneur dès qu’il s’arrête ou termine son exécution.
```
$ docker run --rm -d -p 4000:80 --name node-app node-img:latest
$ docker stop node-app
$ docker ps -a
// => il n'y a aucun conteneur "node-app" arrêté ou existant, car il a été supprimé automatiquement grâce à l'option --rm.
```


### `exec` - Executer un container en Mode Interactif
Pour entrer dans votre conteneur en mode interactif (s’il tourne en arrière-plan) :
```
$ docker exec -it node-app sh
```

Pour entrer dans votre conteneur en mode interactif au moment de son lancement:
```
$ docker run -it -p 4000:80 --name node-app node-img:latest sh
```

### Pour afficher la liste des conteneurs Docker en cours d’exécution:
```
$ doker ps
$ docker container ls
```

### `stop` - Arrêter un conteneur:
La méthode recommandée pour arrêter un conteneur en douceur:
```
$ docker stop <ID-CONTAINER>
```

Une solution de dernier recours pour forcer l’arrêt immédiat:
```
$ docker kill <ID-CONTAINER>
```

Pour forcer l’arrêt de tous les conteneurs en cours, on peut combiner docker kill avec la liste des conteneurs actifs :
```
$ docker kill $(docker ps -q)
```
### `rmi` - Supprimer une image par son ID
```
$ docker rmi <IMAGE_ID or IMAGE_NAME>
```

### `rm` - Supprimer un conteneur existant
Lister tous les conteneurs (y compris les arrêtés)
```
$ docker ps -a
```
```
$ docker rm <CONTAINER_ID or CONTAINER_NAME>
```

### `start` - Démarrer un conteneur

`docker run` permet de créer un nouveau conteneur à partir d’une image.
Pour démarrer un ou plusieurs conteneurs Docker qui sont actuellement arrêtés, sans en créer de nouveaux, il faut utiliser la commande `docker start`.

```
$ docker build -t node-img .
$ docker run -d -p 3000:80 --name node-app node-img:latest
$ docker stop node-app
```
``` 
$ docker start node-app
```

### `attach` -  Se connecter à la sortie standard (STDOUT)
La commande `docker attach` permet de connecter ton terminal aux flux d’entrée (STDIN), de sortie (STDOUT) et d’erreur (STDERR) d’un conteneur Docker déjà en cours d’exécution.
```
$ docker build -t node-img .
// attach mode
$ docker run -p 3000:80 --name node-app node-img:latest
// => voir ce qui se passe à l’intérieur, comme si tu étais devant son terminal. 
// (c’est-à-dire la sortie standard – STDOUT – du processus principal défini par la commande CMD ou ENTRYPOINT du Dockerfile).

```
``` 
$ docker build -t node-img .
$ docker run -d -p 3000:80 --name node-app node-img:latest
// attach mode
$ docker attach node-app
// => la sortie standard – STDOUT – du processus principal défini par la commande CMD ou ENTRYPOINT du Dockerfile
```

Tu peux également suivre les logs d’un conteneur en temps réel avec la commande suivante :
```
$ docker logs -f node-app
```

Pour tout conteneur à l’arrêt, tu peux le redémarrer de cette façon tout en affichant sa sortie standard (stdout) :
```
// attach mode
$ docker start -a node-app
```

