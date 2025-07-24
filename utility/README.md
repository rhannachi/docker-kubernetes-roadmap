
#### Utiliser Docker comme Environnement npm Isolé

Dans cette section, nous montrons comment utiliser Docker pour exécuter des commandes npm (ex : `npm init`, `npm install <package>`, etc.) **sans avoir à installer Node.js sur votre machine locale**.

1. **Construisez l’image :**

```
$ docker build -t node-app .
```

2. **Utilisez l’image pour exécuter des commandes npm dans le dossier courant :**

```
$ docker run -it -v .:/app node-app init
```
Comme nous avons défini `ENTRYPOINT ["npm"]` dans le Dockerfile, il n'est plus nécessaire de taper "npm" devant chaque commande :

- Ici, `init` est interprété comme `npm init`, grâce à l’ENTRYPOINT du Dockerfile.
- Le montage du volume (`-v .:/app`) permet de travailler directement dans votre répertoire local.
- Remplacez `init` par n’importe quelle commande npm, comme `install express` ou `install ping`.

