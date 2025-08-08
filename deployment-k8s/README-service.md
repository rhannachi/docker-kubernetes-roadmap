## Service

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

