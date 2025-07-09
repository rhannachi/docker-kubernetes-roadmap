### Build image Docker
Construit une image Docker à partir du Dockerfile du dossier courant et lui donne le nom (tag) node-img.
```
$ docker build -t node-img .
```
### Afficher la liste des images Docker
```
$ docker image ls
```
### Lancer un conteneur
- **`-d`** : Lance le conteneur en **arrière-plan** (mode détaché)
- **`-p 4000:80`** : **Redirige** le port 4000 de votre machine vers le port 80 du conteneur
- **`--name  node-app`** : **Nomme** le conteneur ` node-app`
- **`node-img:latest`** : Utilise l'**image** `node-img` version `latest`

```
$ docker run -d -p 4000:80 --name  node-app node-img:latest
```

### Executer un container en Mode Interactif
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

### Arrêter un conteneur:
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
### Supprimer une image par son ID
```
$ docker rmi <IMAGE_ID or IMAGE_NAME>
```

### Supprimer un conteneur existant
Lister tous les conteneurs (y compris les arrêtés)
```
$ docker ps -a
```
```
$ docker rm <CONTAINER_ID or CONTAINER_NAME>
```

### Démarrer un conteneur

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