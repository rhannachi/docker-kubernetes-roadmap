## Sommaire
* [Résumé des uses cases de l’application](uses_cases.md)

--- 

## Dockerfile

### - Première manière (ce n’est pas une bonne pratique) de connecter un container Mongo à un autre container
```
# on pull l'image mongo
$ docker pull mongo

# on inspecte l'image pour savoir sur quel port on doit lancer le container
$ docker image inspect mongo:latest
# ....
#             "ExposedPorts": {
#                "27017/tcp": {}
#            },
# .....

# lancer le container avec le bon port
$ docker run -p 27017:27017 --name mongo-app mongo:latest

# on inspecte le container pour récupérer l'URL sur laquelle on peut communiquer avec le container mongo-app
$ docker container inspect mongo-app
# ....
# "IPAddress": "172.17.0.2"
# ....

# on modifie directement dans le code app.js pour mettre la bonne URL du container mongo-app
```

```
# build l'image depuis le Dockerfile
$ docker build -t node-img .

# lancer le container.
# du moment qu'on a lancé le container mongo-app, la base de données de node-app se connecte à ce dernier
$ docker run -p 3000:3000 --name node-app node-img:latest
```

---

