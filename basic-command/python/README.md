### `i` - Mode interactif
Dans cet exemple, nous avons une application Python qui demande à l'utilisateur d'interagir avec le terminal pour introduire deux nombres.
C'est pour cette raison que nous devons utiliser le mode interactif :

```
$ docker build -t py-img .
$ docker run -it --name py-app py-img
```

Ou bien, on peut lancer un conteneur en mode interactif avec cette commande :
```
$ docker start -ia py-app
```

---

### `inspect` - Informations détaillées sur une image Docker
La commande `docker image inspect` est utilisée pour obtenir toutes les informations détaillées sur une image Docker.
```
$ docker image inspect py-img
```

- **ID de l’image** : identifiant unique pour la traçabilité.
  Chemin JSON : `.Id`
- **Tags** : noms et versions associés à l’image.
  Chemin JSON : `.RepoTags`
- **Date de création** : pour vérifier l’actualité.
  Chemin JSON : `.Created`
- **Entrypoint et Cmd** : commande(s) exécutée(s) par défaut au lancement.
  Chemin JSON :
    - Entrypoint : `.Config.Entrypoint`
    - Cmd : `.Config.Cmd`
- **Ports exposés (ExposedPorts)** : ports à publier pour accéder à l’application.
  Chemin JSON : `.Config.ExposedPorts`
- **Variables d’environnement (Env)** : paramètres de configuration intégrés.
  Chemin JSON : `.Config.Env`
- **Volumes** : chemins à monter pour la persistance des données.
  Chemin JSON : `.Config.Volumes`
- **Architecture et OS** : compatibilité avec la plateforme cible.
  Chemin JSON :
    - Architecture : `.Architecture`
    - OS : `.Os`
- **Labels** : métadonnées (auteur, version, usage, etc.).
  Chemin JSON : `.Config.Labels`
- **Layers (couches)** : structure et taille des différentes étapes de construction de l’image.
  Chemin JSON : `.RootFS.Layers`

---

### `cp` - Copier des fichiers/dossiers entre hote/container
La commande `docker cp` permet de copier des fichiers ou des dossiers entre votre machine hôte et un conteneur Docker (ou inversement), que le conteneur soit en cours d’exécution ou arrêté.

Lancer un conteneur et ouvrir un terminal interactif (pour vérifier la copie immédiatement dans le conteneur)
```
$ docker run -it --name py-app py-img:latest sh
```

Pour copier le dossier dump (présent sur la machine) dans le dossier `/app` du conteneur `py-app`
```
$ docker cp dump py-app:/app
```

---

### `tag` `push` `pull` - Cloner, pousser et récupérer une image sur Docker Hub
```
# Se connecter à Docker Hub
$ docker login

# Taguer l’image locale pour l’associer à votre référentiel Docker Hub
$ docker tag py-img:latest rhannachi1991/py-img:latest

# Vérifier la présence de la nouvelle image taguée
$ docker images
# → Vous verrez maintenant rhannachi1991/py-img:latest dans la liste, créée à partir de py-img:latest

# Pousser l’image vers Docker Hub
$ docker push rhannachi1991/py-img:latest

# Supprimer l’image locale
$ docker rmi rhannachi1991/py-img:latest

# Récupérer l’image depuis Docker Hub
$ docker pull rhannachi1991/py-img:latest
```
