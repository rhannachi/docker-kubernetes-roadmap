# Networking

### Introduction:

```
+------------------------- Kubernetes Cluster -------------------------+
|                                                                      |
|  +-----------------------+    +-----------------------+              |
|  |         Pod 1         |    |         Pod 2         |              |
|  |                       |    |                       |              |
|  |  +-----------------+  |    |  +---------------+    |              |
|  |  | Auth API        |  |    |  | Tasks API     |    |              |
|  |  +-----------------+  |    |  +---------------+    |              |
|  |  +-----------------+  |    |                       |              |
|  |  | Users API       |  |    |                       |              |
|  |  +-----------------+  |    |                       |              |
|  +-----------------------+    +-----------------------+              |
|                                                                      |
+----------------------------------------------------------------------+
```

- Le cluster contient deux pods : Pod 1 et Pod 2.
- Pod 1 a deux containers : "Auth API" et "Users API".
- Pod 2 a un container : "Tasks API".
- L’utilisateur peut accéder de l’extérieur uniquement aux conteneurs «Tasks API» et «Users API». 
- La communication entre «Users API» et «Auth API» est interne au Pod, il n’y a pas d’accès externe à «Auth API». 
- «Tasks API» peut communiquer avec «Auth API» via la communication interne du cluster (entre Pods)

[k8s.yaml](k8s.yaml)

### Communication entre «Users API» et «Auth API»

Dans la section `containers`, on a ajouté deux conteneurs dans le même Pod. Cela permet aux deux conteneurs de communiquer directement en interne, en utilisant l’adresse `localhost`, car ils partagent le même espace réseau et la même IP.
C’est pour cette raison que la variable d’environnement `AUTH_API_URL` dans l’application "Users API" prend la valeur `localhost` : elle pointe vers le service "Auth API" accessible sur la même IP Pod, via le port exposé par le conteneur "Auth API".

À noter:
- Dans Docker Compose, il est possible d’accéder à un autre conteneur via son nom (`auth:80`), car chaque conteneur a son propre réseau virtuel ou peut utiliser un bridge réseau.
- Dans Kubernetes, les conteneurs d’un même Pod **doivent** communiquer via l’adresse `localhost` (`http://localhost:80`), puisque le Pod possède une seule IP partagée pour tous ses conteneurs.
- Si les deux services étaient dans des Pods différents, il faudrait passer par un Service Kubernetes, et utiliser le nom DNS du Service pour communiquer entre Pods.

```
    k8s-users.yaml
    
    spec:
      containers:
        - name: users-container
          image: rhannachi1991/users-net-k8s:latest
          env:
            - name: AUTH_API_URL
              value: 'localhost'
            ...
        - name: auth-container
          image: rhannachi1991/auth-net-k8s:latest
```
[postman-collection-api.json](./postman-collection-api.json)

![image-1.png](images/image-1.png)

### Communication entre «Tasks API» et «Auth API»
[k8s-users.yaml](./k8s-users.yaml), [k8s-tasks.yaml](./k8s-tasks.yaml), [k8s-auth.yaml](./k8s-auth.yaml)

À ce niveau, on constate que si l’on souhaite:
- que «Users API» et «Auth API» communiquent uniquement en interne au Pod via localhost,
- que «Tasks API» (déployé dans un autre Pod) puisse communiquer avec «Auth API»,
- et que «Auth API» ne soit pas exposé à l’extérieur du cluster,

**il est nécessaire de placer «Auth API» dans un Pod séparé et de créer un Service interne (`ClusterIP`).**

**Cela permet** :
- d’avoir «Users API» et «Tasks API» accessibles de l’extérieur,
- et d’assurer la communication entre «Users API», «Tasks API» et «Auth API» via le réseau interne du cluster et le Service Kubernetes, sans ouverture externe de «Auth API».

```
+------------------------- Kubernetes Cluster -------------------------+
|                                                                      |
|  +-----------------------+    +-----------------------+              |
|  |        Pod Users      |    |       Pod Tasks       |              |
|  |  +-----------------+  |    |  +---------------+    |              |
|  |  | Users API       |  |    |  | Tasks API     |    |              |
|  |  +-----------------+  |    |  +---------------+    |              |
|  +-----------------------+    +-----------------------+              |
|                                                                      |
|  +-----------------------+                                           |
|  |        Pod Auth       |                                           |
|  |  +-----------------+  |                                           |
|  |  | Auth API        |  |                                           |
|  |  +-----------------+  |                                           |
|  +-----------------------+                                           |
|                                                                      |
+----------------------------------------------------------------------+
```

Voici les cas d’utilisation pour chacun des 4 types de services Kubernetes :

``` 
apiVersion: v1
kind: Service
metadata:
  name: ...
spec:
  type: LoadBalancer | ClusterIP | NodePort | ExternalName
  selector:
    ....
```

1. **ClusterIP**
    - Cas d’utilisation : Communication interne au cluster uniquement.
    - Idéal pour exposer un service uniquement aux autres pods du cluster (par exemple backend API, base de données).
    - Pas accessible de l’extérieur.

2. **NodePort**
    - Cas d’utilisation : Exposer un service sur un port spécifique sur chaque nœud.
    - Utile pour un accès externe simple sur un port fixe sans équilibreur de charge.
    - Bien pour tests locaux ou clusters sans cloud provider.

3. **LoadBalancer**
    - Cas d’utilisation : Exposer le service à l’extérieur via un équilibreur de charge cloud (AWS ELB, GCP, Azure...).
    - Idéal pour les applications accessibles au public, APIs, frontends web.
    - Fournit une IP externe stable avec équilibrage de charge.

4. **ExternalName**
    - Cas d’utilisation : Pointer un service Kubernetes vers un service externe en dehors du cluster via un nom DNS.
    - Permet d’intégrer ou d’accéder facilement à des services externes sans modifier la configuration des clients internes.

Dans notre cas, nous avons besoin du type de service **LoadBalancer** pour « Users API » et « Tasks API » afin d’exposer ces applications à l’extérieur du cluster, et du type **ClusterIP** pour « Auth API » afin que ce service soit accessible uniquement en interne au cluster.

```
k8s-auth.yaml

apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  # ClusterIP: Idéal pour exposer un service uniquement aux autres pods du cluster
  type: ClusterIP
  selector:
    app: auth-pod
  ports:
    - port: 80             # Port d'accès du service
      targetPort: auth-port  # Port exposé par le conteneur Auth API
      protocol: TCP
```
```
k8s-tasks.yaml

...
  template:
    metadata:
      labels:
        app: tasks-pod
    spec:
      containers:
        - name: tasks-container
          image: rhannachi1991/tasks-net-k8s:latest
          env:
            - name: AUTH_API_URL
              # Utilisation du nom DNS du service Auth API pour la communication
              value: 'auth-service:80'
...
```
```
k8s-users.yaml

...
  template:
    metadata:
      labels:
        app: users-pod
    spec:
      containers:
        - name: users-container
          image: rhannachi1991/users-net-k8s:latest
          env:
            - name: AUTH_API_URL
              # Utilisation du nom DNS du service Auth API pour la communication
              value: 'auth-service:80'
...
```

#### Génération automatique de variables d'environnement dans Kubernetes

Il existe une autre manière de faire, moins recommandée :

Kubernetes génère automatiquement des variables d’environnement dans chaque Pod pour chaque Service visible dans le cluster. Ces variables représentent l’adresse IP et le port du Service.

Par exemple, pour un Service nommé `auth-service`, tu auras automatiquement dans ton Pod/Container (tasks-container et users-container) des variables d’environnement telles que :

- `AUTH_SERVICE_SERVICE_HOST` : adresse IP du Service (ClusterIP)
- `AUTH_SERVICE_SERVICE_PORT` : port exposé par le Service

Ces variables d’environnement permettent d’accéder dynamiquement aux adresses internes des services (comme `auth-service`), évitant de configurer statiquement des URL dans les fichiers de déploiement.

Dans notre code Node.js (`tasks-app.js` et `users-app.js`), il suffit d’utiliser les variables d’environnement :  
`process.env.AUTH_SERVICE_SERVICE_HOST` et `process.env.AUTH_SERVICE_SERVICE_PORT` pour récupérer l’adresse IP et le port du service `auth-service`.

### Ajouter un Front-End

Il faut savoir que notre Front-End a besoin de la variable d'environnement `REACT_APP_TASKS_API_URL` qui est passée en argument lors du build.

Cette variable `REACT_APP_TASKS_API_URL` permet au front de connaître l’URL de l’API tasks.

Pour l’obtenir, il faut d’abord déployer la partie Back-End dans Kubernetes, puis lancer la partie Front-End.

```
# Lancer le Back-End Kubernetes
$ kubectl apply -f k8s-users.yaml -f k8s-tasks.yaml -f k8s-auth.yaml

# Exposer les LoadBalancers des services tasks et users (si besoin)
$ minikube service tasks-service users-service
```

Récupérer l’adresse IP du LoadBalancer exposé par Minikube pour le service `tasks-service` :

```
$ minikube service tasks-service --url
# Exemple de sortie :
# http://192.168.49.2:30370
```

Ajouter l’adresse IP récupérée comme argument `REACT_APP_TASKS_API_URL` lors du build du front-end Docker :

```
$ docker build --build-arg REACT_APP_TASKS_API_URL="http://192.168.49.2:30370" -t rhannachi1991/frontend-net-k8s:latest ./front-end
$ docker push rhannachi1991/frontend-net-k8s:latest
```

Enfin, ajouter un nouveau fichier Kubernetes de déploiement pour le front-end :  
[k8s-frontend.yaml](./k8s-frontend.yaml)

```
# Lancer le Front-End Kubernetes
$ kubectl apply -f k8s-frontend.yaml
$ minikube service frontend-service 
```

Cette méthode garantit que le front React est construit avec la bonne URL de l’API selon l’environnement Minikube où le back-end est exposé.



