## Résumé des uses cases de l’application

#### 1. Affichage de la page d’accueil (formulaire de feedback)

- **URL** : `/`
- **Description** :
  L’utilisateur accède à la page principale, voit un formulaire pour soumettre un feedback (titre + texte).


#### 2. Soumission d’un feedback

- **URL** : `/create` (méthode POST)
- **Description** :
  L’utilisateur remplit le formulaire et soumet un feedback.
    - Si le titre n’existe pas encore, le feedback est enregistré.
    - Si le titre existe déjà, l’utilisateur est redirigé vers une page d’erreur.


#### 3. Gestion des doublons de feedback

- **URL** : `/exists`
- **Description** :
  Si un feedback avec le même titre existe déjà, l’utilisateur est informé via une page dédiée.


#### 4. Consultation des feedbacks existants

- **URL** : `/feedback/<nom-du-fichier>`
- **Description** :
  Les feedbacks enregistrés sont accessibles en lecture directe via cette URL (fichiers servis en statique).

---

## Dockerfile


Lorsque tu déclares un volume dans un Dockerfile, par exemple :

```
VOLUME /app/feedback
```

tu indiques à Docker que le contenu du dossier `/app/feedback` doit être persistant, c’est-à-dire conservé indépendamment du cycle de vie du conteneur.

### Anonymous Volumes :

Par défaut, si tu lances un conteneur à partir de cette image **sans attacher explicitement de volume**, Docker crée automatiquement un **volume anonyme** pour ce dossier. Ce volume est stocké sur l’hôte dans :

```
/var/lib/docker/volumes/
```

Exemple :

```
$ docker run -p 3000:80 --name node-app node-img:latest
```

Dans ce cas, Docker gère le volume de manière transparente, sans nom spécifique.

### Named Volumes :

Tu peux choisir d’attacher un **volume nommé** pour mieux contrôler et retrouver tes données :

```
$ docker run -p 3000:80 -v feedback:/app/feedback --name node-app node-img:latest
```

Ici, le volume `feedback` sera créé (s’il n’existe pas déjà) et monté dans le conteneur à l’emplacement `/app/feedback`. Les données seront stockées dans `/var/lib/docker/volumes/feedback/_data` sur l’hôte.

**Attacher un dossier local (bind mount)**

Il est aussi possible de lier un dossier du projet (ou de n’importe quel chemin local) au volume du conteneur :

```
$ docker run -p 3000:80 -v ./feedback:/app/feedback --name node-app node-img:latest
```

Dans ce cas, le dossier `./feedback` de ton projet local sera synchronisé avec `/app/feedback` dans le conteneur. Toute modification sera visible instantanément des deux côtés.

**Résumé :**
- L’instruction `VOLUME` dans un Dockerfile déclare un dossier persistant.
- Par défaut, Docker crée un volume anonyme dans `/var/lib/docker/volumes/`.
- Tu peux attacher un volume nommé ou un dossier local avec l’option `-v` lors du lancement du conteneur pour mieux contrôler où sont stockées tes données.

---


