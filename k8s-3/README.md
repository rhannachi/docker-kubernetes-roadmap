# Les volumes
Les volumes, tout comme les conteneurs, sont attachés aux Pods.
Les Pods sont **éphémères** dans un cluster Kubernetes : ils peuvent être supprimés ou remplacés pour diverses raisons (scaling, déploiement, panne, etc.).
Cela entraîne donc la suppression des volumes directement attachés aux Pods.

C’est pour cette raison que, dans Kubernetes, il existe [différents types de volumes](https://kubernetes.io/docs/concepts/storage/) permettant de répondre à des besoins variés.

Nous allons nous concentrer principalement sur **trois types de volumes** :
- **CSI**
- **emptyDir**
- **hostPath**

**Commençons par créer notre application**:
``` 
$ docker build -t rhannachi1991/k8s-story .
$ docker login
$ docker push rhannachi1991/k8s-story:latest
```
``` 
$ kubectl apply -f=k8s.yaml
$ minikube service story-service
```
## Sans volume

Avant d'ajouter un volume, faisons un petit test pour montrer qu’on perd les données enregistrées dans un **conteneur** si **celui-ci est arrêté**, par exemple suite à un crash.
- 1 - Ajouter une nouvelle story via la requête `POST /story`
- 2 - Vérifier que la story ajoutée est bien récupérée avec `GET /story`
- 3 - Simuler une erreur via l'endpoint `GET /error` pour forcer le crash ou le **redémarrage du conteneur**
- 4 - Re-vérifier les stories ajoutées précédemment avec `GET /story` ; on constatera que toutes les informations ont été perdues, car le conteneur a été recréé sans persistance des données.

![](./images/1.png)
![](./images/2.png)

## Avec volume
### emptyDir

[k8s.yaml](./k8s.yaml)\
Après avoir ajouté la section `volumes` de type "**emptyDir**" dans la ressource `kind: Deployment`, on constate que même si le conteneur plante via l’endpoint `GET /error`, le Pod recrée un nouveau conteneur sans perte de données.
En effet, le volume "**emptyDir**" appartient au Pod et non au conteneur : lorsque ce dernier est remplacé, le volume reste attaché et monté dans le nouveau conteneur, ce qui permet de conserver les informations.

### hostPath
[k8s-volume-2.yaml](./k8s-volume-2.yaml)\
Cependant, si on modifie ensuite le champ `spec.replicas` pour scaler à `2 Pods`, on constate que lorsque l'on fait un `POST /story`, les données sont stockées **uniquement dans le Pod en cours d'exécution.**
Cela entraîne une distribution des données entre les différents Pods : selon le Pod qui répond à la requête `GET /story`, on obtiendra **des données différentes**, car chaque Pod a son propre volume **"emptyDir"** isolé.

Une des solutions consiste à utiliser un volume de type hostPath avec `type: DirectoryOrCreate`.
Cette approche permet de créer automatiquement le répertoire sur le `worker node` s’il n’existe pas.
Ainsi, le volume n’est plus stocké uniquement au niveau du Pod, mais directement sur le système de fichiers du nœud, ce qui garantit la persistance des données tant que le Pod est recréé sur le même nœud.




