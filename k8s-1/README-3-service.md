## Service
Quelles sont les limitations au niveau des Pods qui nous empêchent d'exposer notre conteneur vers l'extérieur ?
- L'adresse IP du Pod change à chaque fois que le Pod est remplacé
- Cette adresse IP est inaccessible depuis l'extérieur du cluster

**C'est pour cela que le Service entre en jeu:**\
Un **Service** dans Kubernetes est un objet (comme un Deployment) qui permet de **regrouper un ensemble de Pods** appartenant au même type **grâce aux labels et sélecteurs**. Il les expose ensuite via une **adresse IP stable** qui peut être interne au cluster ou externe (selon le type de Service choisi).

Le Service résout **deux problématiques majeures** des Pods par défaut :

1. **Les Pods ne sont pas directement accessibles depuis l'extérieur** du cluster
2. **L'adresse IP des Pods change** à chaque redémarrage ou recréation

#### Types de Services et Exposition

Kubernetes propose plusieurs **types de Services** :

- **ClusterIP** (par défaut) : Expose le Service uniquement à l'intérieur du cluster avec une IP interne stable

- **NodePort** : Expose le Service sur chaque nœud du cluster via un port statique, permettant l'accès depuis l'extérieur

- **LoadBalancer** : Crée un load balancer externe (généralement via un fournisseur cloud) pour exposer le Service avec une IP publique

- **ExternalName** : Mappe le Service vers un nom DNS externe

``` 
$ kubectl expose deployment first-app --type=LoadBalancer --port=8080
```

Cette commande **crée un Service Kubernetes** pour exposer un Deployment existant nommé "first-app".

### **Décomposition de la commande**

**`kubectl expose`** : Commande qui crée automatiquement un Service pour exposer une ressource Kubernetes existante (Deployment, Pod, ReplicaSet).

**`deployment first-app`** : Spécifie la **ressource à exposer** - ici un Deployment appelé "first-app". Kubernetes utilisera automatiquement les **labels du template de Pod du Deployment** comme sélecteur pour le Service.

**`--type=LoadBalancer`** : Définit le **type de Service** créé. LoadBalancer crée un service avec une IP externe fournie par le fournisseur cloud (AWS, GCP, Azure).

**`--port=8080`** : Définit le **port d'écoute du Service** - les clients se connecteront sur ce port pour accéder à l'application.

### **Ce que fait cette commande**

1. **Examine le Deployment** "first-app" et récupère les **labels du template de Pod**
2. **Crée un Service** qui utilise ces labels comme sélecteurs pour identifier les Pods cibles
3. **Configure le routage** : le trafic arrivant sur le port 8080 du Service sera **redirigé vers les Pods** du Deployment
4. **Demande une IP externe** au fournisseur cloud pour rendre l'application accessible depuis Internet

**Absence d'infrastructure cloud native pour le LoadBalancer :**
Minikube est un environnement Kubernetes local qui simule un cluster sur une seule machine. Contrairement aux fournisseurs cloud comme AWS, GCP ou Azure qui ont des load balancers natifs, Minikube ne dispose pas d'infrastructure capable de provisionner automatiquement des IP externes.

C'est pour cette raison que quand on tape la commande `kubectl get services`
Pour notre service first-app, on constate que **l'External-IP** est en état de "pending" et elle restera comme ça, car **Minikube ne fournit pas d'implémentation native de LoadBalancer**.

Uniquement sur Minikube, pour rendre notre application accessible à travers ce load balancer il faut taper la commande: `minikube service first-app`.
Si on était dans une architecture réelle AWS, on n'aurait pas besoin de taper cette commande

```
$ minikube service first-app
```

| NAMESPACE | NAME | TARGET PORT | URL |
| :-- | :-- | :-- | :-- |
| default | first-app | 8080 | http://192.168.49.2:32259 |

🎉 Ouverture du service default/first-app dans le navigateur par défaut...

