#  Deployment

```
$ docker build -t rhannachi1991/first-app-k8s:latest .
$ docker login
$ docker push rhannachi1991/first-app-k8s:latest
```

### 1. Démarrer Minikube

```
$ minikube start --driver=docker
```
- Cette commande démarre un cluster Kubernetes local sur ta machine en utilisant Docker comme moteur de virtualisation.

### 2. Créer un Déploiement
```
$ kubectl create deployment first-app --image=rhannachi1991/first-app-k8s:latest
```
- Un *deployment* sert à déployer et gérer automatiquement un ou plusieurs exemplaires (pods) d’une application définie par une image Docker.
- La commande ci-dessus demande à Kubernetes de lancer le ou les pods, chacun exécutant le conteneur basé sur l’image spécifiée.
- Kubernetes veille en permanence à ce qu'il y ait toujours le nombre voulu de pods en fonctionnement.
  Si un pod tombe, il le recrée automatiquement pour garantir la disponibilité de ton application.

### 3. Vérifier le Déploiement et les Pods
```
$ kubectl get deployment
```
- Permet de vérifier que ton deployment a bien été créé.
- Tu vois notamment, dans la colonne READY, combien de pods prévus sont en cours de fonctionnement.\
**Explication simple :** Si tu vois READY = 1/1, cela signifie que ton deployment a bien créé un pod actif.

```
$ kubectl get pods
```
- Affiche la liste des pods en cours dans le cluster :\
C’est ici que tu peux vérifier précisément si ton application tourne : chaque pod représente une instance active.

#### À retenir
- **Un deployment** gère le nombre et le cycle de vie des pods : il les crée, les relance si besoin, et peut les mettre à jour.
- **Les pods** sont les unités d’exécution : chaque pod contient ton application (dans un ou plusieurs conteneurs).
- Quand tu supprimes un pod créé par un deployment, Kubernetes le recrée automatiquement : cela garantit la haute disponibilité.

### 4. Supprimer un pod et observer si Kubernetes le recrée automatiquement

1. Repère le nom exact d’un pod que tu veux supprimer (par exemple, first-app-xxxxxxxxxx-yyyyy).
```
$ kubectl get pods
```
2. Supprimer ce pod
```
$ kubectl delete pod <nom-du-pod>
```
**Ce que fait Kubernetes après la suppression:**\
Si le pod a été créé via un Deployment (c’est le cas dans ton exemple), Kubernetes constate qu’il manque un pod pour atteindre le nombre demandé (replica).\
**Résultat:** le contrôleur (Deployment ou ReplicaSet) lance **AUTOMATIQUEMENT** un nouveau pod pour remplacer celui manquant.\
En l’espace de quelques secondes, tu verras un pod réapparaître avec un nouveau nom unique.

Vous pouvez visualiser le nombre de pods déployés et d’autres métriques grâce au dashboard de Minikube:
```
$ minikube dashboard
```
### ReplicaSet VS Deployment
- **ReplicaSet**  
  Son rôle est uniquement de s’assurer qu’un certain nombre de pods identiques fonctionnent en permanence. Si un pod tombe, il en recrée un autre. Il ne gère pas les mises à jour ou les retours en arrière : tout changement doit être fait “à la main”.

- **Deployment**  
  C’est un outil plus complet et recommandé pour gérer tes applications. Il utilise des ReplicaSets en coulisses, mais il ajoute :
    - gestion des mises à jour (changement de version en douceur)
    - possibilité de revenir en arrière après une erreur
    - gestion automatisée de tout le cycle de vie de ton application

**À retenir :**  
En pratique, on utilise toujours Deployment pour lancer et gérer une application Kubernetes, car il simplifie la gestion des versions, des évolutions et des incidents. ReplicaSet, lui, travaille en arrière-plan, automatiquement géré par le Deployment.

---


## Cycle de vie d'un déploiement Kubernetes "kubectl"

```
$ kubectl create deployment <nom> --image=<image>
```

déclenche la création et l’exécution de ton application sur un cluster Kubernetes.\
Voici comment cette action se propage et le lien entre chaque composant clé :

- **1 - kubectl**
  C'est l'outil en ligne de commande : quand tu tapes la commande, **kubectl** communique avec **l'API Server** du **Master Node**, lui envoyant l'ordre de **créer un Deployment** à partir d'une **image**.
- **2 - API Server**
  Il reçoit la demande, **valide la requête**, l'**authentifie**, puis **stocke l'objet Deployment dans etcd** (la base de données clé-valeur du cluster).
- **3 - Deployment \& ReplicaSet**
  Le **Deployment Controller** (qui fait partie du Controller Manager) détecte le nouveau Deployment et **crée automatiquement un ReplicaSet** correspondant. Le ReplicaSet se charge ensuite de maintenir à tout moment le **nombre demandé de Pods**.
- **4 - Scheduler**
  Il surveille les Pods **"Pending"** (pas encore assignés à un nœud). Pour chaque nouveau **Pod** à lancer, il les **assigne** à des **Worker Nodes** selon les ressources disponibles et les contraintes.
- **5 - Worker Node**
  C'est l'un des serveurs "**exécutants**" du cluster.
  Lorsque le **Scheduler** a assigné un Pod au nœud, le **kubelet** local se charge de **créer le Pod**.
- **6 - Kubelet**
  Ce petit agent tourne sur chaque **Worker Node**. Il **interroge régulièrement** l'API Server pour connaître les Pods qui lui sont assignés, puis **pilote le container runtime** (Docker, containerd, etc.) pour créer les conteneurs.
- **7 - Pod**
  Le Pod est l'unité de base d'exécution dans Kubernetes. Il contient un ou plusieurs conteneurs (souvent un seul).
  C'est le kubelet qui s'assure que le Pod tourne bien sur le Worker Node choisi.
- **8 - Container**
  À l'intérieur du Pod, c'est le **container runtime** qui télécharge l'image et démarre les conteneurs qui exécutent l'application à partir de l'image spécifiée dans la commande `kubectl create ...`.

