### Build image Docker
Construit une image Docker à partir du Dockerfile du dossier courant et lui donne le nom (tag) node-app-image.
```
$ docker build -t node-app-image .
```
### Afficher la liste des images Docker
```
$ docker image ls
```
### Lancer un conteneur
- **`-d`** : Lance le conteneur en **arrière-plan** (mode détaché)
- **`-p 4000:3000`** : **Redirige** le port 4000 de votre machine vers le port 3000 du conteneur
- **`--name node-app-container`** : **Nomme** le conteneur `node-app-container`
- **`node-app-image:latest`** : Utilise l'**image** `node-app-image` version `latest`

```
$ docker run -d -p 4000:3000 --name node-app-container node-app-image:latest
```

### Executer un container en Mode Interactif
Pour entrer dans votre conteneur en mode interactif, utilisez la commande suivante :
```
$ docker exec -it node-app-container sh
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


