# Les volumes
Les volumes, tout comme les conteneurs, sont attachés aux Pods.
Les Pods sont **éphémères** dans un cluster Kubernetes : ils peuvent être supprimés ou remplacés pour diverses raisons (scaling, déploiement, panne, etc.).
Cela entraîne donc la suppression des volumes directement attachés aux Pods.

C’est pour cette raison que, dans Kubernetes, il existe [différents types de volumes](https://kubernetes.io/docs/concepts/storage/) permettant de répondre à des besoins variés.

Nous allons nous concentrer principalement sur **deux types de volumes** :
- **emptyDir**
- **hostPath**

On verra aussi les PV et PVC, des objets Kubernetes qui servent à abstraire et à gérer le stockage dans un cluster.

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

### 1. emptyDir
[k8s-volume-1.yaml](k8s-volume-1.yaml)\
Après avoir ajouté la section `volumes` de type "**emptyDir**" dans la ressource `kind: Deployment`, on constate que même si le conteneur plante via l’endpoint `GET /error`, le Pod recrée un nouveau conteneur sans perte de données.
En effet, le volume "**emptyDir**" appartient au Pod et non au conteneur : lorsque ce dernier est remplacé, le volume reste attaché et monté dans le nouveau conteneur, ce qui permet de conserver les informations.

### 2. hostPath
[k8s-volume-2.yaml](./k8s-volume-2.yaml)\
Cependant, si on modifie ensuite le champ `spec.replicas` pour scaler à `2 Pods`, on constate que lorsque l'on fait un `POST /story`, les données sont stockées **uniquement dans le Pod en cours d'exécution.**\
Cela entraîne une distribution des données entre les différents Pods : selon le Pod qui répond à la requête `GET /story`, on obtiendra **des données différentes**, car chaque Pod a son propre volume **"emptyDir"** isolé.

Une des solutions consiste à utiliser un volume de type hostPath avec `type: DirectoryOrCreate`.
Cette approche permet de créer automatiquement le répertoire sur le `worker node` s’il n’existe pas.\
Ainsi, le volume n’est plus stocké uniquement au niveau du Pod, mais directement sur le système de fichiers du nœud, ce qui garantit la persistance des données tant que le Pod est recréé sur le même nœud.

### 3. Persistent volume PV et PVC
[k8s-volume-3.yaml](*./k8s-volume-3.yaml*), [host-pv-3.yaml](*./host-pv-3.yaml*), [host-pvc-3.yaml](*./host-pvc-3.yaml*)

PV = stockage physique ou abstrait disponible dans le cluster
PVC = demande d’espace de stockage faite par un pod ou un utilisateur

#### Pourquoi `hostPath` n'est pas la solution idéale pour la persistance des données

- **Dépendance au nœud** : Le volume `hostPath` monte un dossier local du worker node dans le Pod. Si le Pod est déplacé (reschedulé) sur un autre nœud, il n'aura pas accès aux données du chemin défini sur le précédent nœud.
- **Pas de portabilité** : Tes Pods ne sont plus portables. Leur état dépend d'un emplacement précis sur le disque d'une machine donnée.
- **Sécurité** : `hostPath` présente des risques de sécurité, car il expose le système de fichiers du nœud au conteneur. Une application malveillante pourrait nuire à l'intégrité du nœud.
- **Pas de gestion cluster-wide** : Il n'y a pas de gestion native du cycle de vie du stockage, ni de solution de sauvegarde, de réplication ou de tolérance en cas de panne d'un nœud.
- **Usage recommandé** : `hostPath` est surtout fait pour des cas très spécifiques de debug, logging ou CI/CD—jamais pour de la persistance applicative en production.

Il faut préférer un **PersistentVolume** ([PV](*./host-pv-3.yaml*)) et un **PersistentVolumeClaim** ([PVC](*./host-pvc-3.yaml*)) pour rendre la persistance **cluster-scoped**, portable et sécurisée.

**Note importante** : Cependant, même avec un PV/PVC utilisant `hostPath`, **le stockage physique reste sur le worker node**. Cette approche améliore la gestion (abstraction cluster-wide), mais n'élimine pas la dépendance au nœud.
``` 
  host-pv-3.yaml

  hostPath:
    path: /data
    type: DirectoryOrCreate
```

Pour ne pas faire du stockage physique sur le worker node, il faut utiliser à la place de `hostPath` :
— **un volume réseau ou cloud**, par exemple :
- `nfs` (Network File System)
- `awsElasticBlockStore` (EBS sur AWS)
- `csi` (Container Storage Interface driver, type EFS, S3, etc.)
- `azureDisk`, `azureFile`
- `gcePersistentDisk` (Google Cloud)
- `cephfs`, `iscsi`, `glusterfs`…

Ces types permettent au volume d’être **stocké en dehors des worker nodes** (sur un NAS, un SAN, un service Cloud externalisé, etc.), ce qui assure la persistance et la portabilité des données même si un worker node disparaît ou change.

#### storageClassName

Le champ **storageClassName** dans un **PersistentVolumeClaim (PVC)** ou un PersistentVolume (PV) indique la **classe de stockage** que le PVC souhaite utiliser pour demander un volume et comment créer ou gérer le stockage demandé.

Liste des StorageClasses disponibles dans le cluster:

``` 
$ kubectl get storageclass
NAME                 PROVISIONER                RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
standard (default)   k8s.io/minikube-hostpath   Delete          Immediate           false                  8d
```

#### storage

Dans notre PV, nous définissons la taille du volume persistant (ici 2 gigaoctets), qui est la capacité maximale accessible par les Pods qui monteront ce volume.

Cette valeur doit être supérieure ou égale à ce que demande le PVC pour que la liaison (binding) puisse s'effectuer.

```
host-pv-3.yaml

spec:
  capacity:
    storage: 2Gi
```

```
host-pvc-3.yaml

spec:
  resources:
    requests:
      storage: 1Gi
```
