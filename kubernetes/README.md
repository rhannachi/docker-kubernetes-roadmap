## Kubernetes

### 🧠 MASTER NODE (Plan de contrôle)

1. **API Server**

    * C’est **la porte d’entrée** de Kubernetes.
    * Tout passe par lui : `kubectl`, Dashboard, autres composants.
    * Il reçoit les ordres (ex : créer un Pod), et les transmet aux autres composants.

2. **Scheduler**

    * Il choisit **sur quel Worker Node** déployer un nouveau Pod.
    * Il regarde les ressources dispo, etc.

3. **Controller Manager**

    * Il **surveille et ajuste** l’état du cluster (par exemple : recréer un Pod qui a planté).

4. **etcd**

    * C’est **la base de données** de Kubernetes.
    * Il garde la configuration et l’état du cluster.

---

### 🛠 WORKER NODE

1. **kubelet**

    * Reçoit les instructions de l’API Server.
    * **Gère les Pods sur ce nœud** (créer, démarrer, surveiller…).

2. **kube-proxy**

    * Gère **le réseau** : il connecte les Pods entre eux, aux Services, etc.

3. **Pods**

    * Unité de base de Kubernetes. Chaque Pod contient **un ou plusieurs conteneurs**.
    * Kubernetes déploie des Pods, pas des conteneurs directement.

4. **Containers**

    * Ton application, empaquetée dans un conteneur (souvent Docker).

5. **Volumes (optionnel)**

    * Espace de stockage partagé pour les conteneurs d’un Pod.

---

### 🔗 OUTILS EXTERNES

* **kubectl** : Ligne de commande pour interagir avec l’API Server.
* **Kubernetes Dashboard** : Interface graphique.
* **minikube** : Kubernetes local (pour apprentissage ou test).
* **EKS (AWS)** : Service Kubernetes géré sur AWS.
* **Kubermatic** : Plateforme pour déployer Kubernetes (multi-cloud).

![](./images/kub.png)

---
## Introduction:
Kubernetes est un système open source qui permet d’automatiser le déploiement, la gestion et la mise à l’échelle d’applications conteneurisées sur un groupe de serveurs appelé « cluster ».\
Kubernetes utilise plusieurs **« objets »** de base pour organiser et exécuter les applications :

- **Les Pods** : l’unité la plus petite, contenant un ou plusieurs conteneurs qui partagent le même réseau et stockage. Les conteneurs d’un même Pod peuvent donc communiquer entre eux via localhost.
- **Les Deployments** : objets de contrôle qui gèrent la création et la gestion automatique de Pods. Par exemple, si un Pod échoue ou disparaît, le Deployment créera automatiquement un nouveau Pod pour maintenir le nombre souhaité.
- **Les Services** : objets qui rendent accessibles les Pods par le réseau, à l’intérieur ou à l’extérieur du cluster. Un Service attribue une IP fixe et peut répartir la charge entre plusieurs Pods.
- **Les Volumes** : permettent de gérer le stockage persistant partagé entre les conteneurs d’un Pod ou entre plusieurs Pods.

Pour créer ou modifier les **objets Kubernetes**, on utilise deux approches :

- **Déclarative** : on décrit l’état voulu du cluster dans des fichiers (généralement en YAML), puis Kubernetes se charge d’atteindre et de maintenir cet état.
- **Impérative** : on donne directement des commandes à Kubernetes (exemple : kubectl run, kubectl delete) pour créer, modifier ou supprimer des objets instantanément.

**Il est important de comprendre que :**

- Les **Pods sont éphémères** : Kubernetes peut les supprimer ou les remplacer à tout moment (après un redémarrage, une panne ou une mise à jour).
- D’habitude, un Pod reçoit une adresse IP interne au cluster. Pour exposer une application vers l’extérieur, on utilise un Service.
- Plutôt que de gérer **~~les Pods manuellement~~**, on utilise **les objets de contrôle** (comme Deployment, StatefulSet, ReplicaSet…) qui se chargent d’en **créer**, de les **remplacer** ou de les **supprimer** selon les besoins du cluster et les consignes de l’utilisateur.
