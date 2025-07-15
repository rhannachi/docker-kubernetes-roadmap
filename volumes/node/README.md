## Sommaire
* [Résumé des uses cases de l’application](uses_cases.md)
* [combinaison et la fusion de différents volumes](./combining_marging_volumes.md)

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

#### Inspection de l'image et Explication du Comportement Observé

Lorsque tu utilises ce Dockerfile :

```dockerfile
FROM node:current-alpine3.22
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 80
VOLUME /app/feedback
VOLUME /app/node_modules
CMD ["npm", "start"]
```

et que tu construis l’image avec :

```
$ docker build -t node-img .
```

puis que tu inspectes l’image avec :

```
$ docker image inspect node-img
```

tu remarques que la section "Config" inclut :

- Les instructions EXPOSE, VOLUME, CMD et WORKDIR.
- Certaines variables d’environnement et propriétés héritées de l’image parent (ici, `node:current-alpine3.22`).

Notamment, la présence d’un `"Entrypoint": ["docker-entrypoint.sh"]` qui ne figure pas dans ton Dockerfile mais est incluse par défaut dans l’image officielle Node.js.

```
        "Config": {
            "ArgsEscaped": true,
            "Cmd": [
                "npm",
                "start"
            ],
            "Entrypoint": [
                "docker-entrypoint.sh"
            ],
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "NODE_VERSION=24.4.0",
                "YARN_VERSION=1.22.22"
            ],
            "ExposedPorts": {
                "80/tcp": {}
            },
            "Labels": null,
            "OnBuild": null,
            "User": "",
            "Volumes": {
                "/app/feedback": {},
                "/app/node_modules": {}
            },
            "WorkingDir": "/app"
        }

```



