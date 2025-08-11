## Approche Déclarative

L’approche déclarative consiste à créer un fichier de configuration YAML décrivant l’état souhaité de notre ressource Kubernetes, plutôt que de tout exécuter directement via l’invite de commande.

Cela permet de versionner, réutiliser et modifier facilement la configuration sans devoir retaper les commandes manuellement.

### Deployment
➡️ Consultez le fichier [deployment.yaml](./deployment.yaml) pour voir un exemple complet de déclaration d’un Deployment.

Pour appliquer une configuration Kubernetes à partir d’un fichier YAML:
```
$ kubectl apply -f=deployment.yaml
deployment.apps/second-app-deployment created
```
```
$ kubectl get deployments
NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
second-app-deployment   1/1     1            1           3m44s
```

### Service

➡️ Consultez le fichier [service.yaml](./service.yaml) pour voir un exemple complet de déclaration d’un Service.

Pour appliquer une configuration Kubernetes à partir d’un fichier YAML:
```
$ kubectl apply -f=service.yaml
service/backend created
```
```
$ kubectl get service
NAME         TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
backend      LoadBalancer   10.98.104.28   <pending>     80:30780/TCP   82s
kubernetes   ClusterIP      10.96.0.1      <none>        443/TCP        5d
```
```
$ minikube service backend
|-----------|---------|-------------|---------------------------|
| NAMESPACE |  NAME   | TARGET PORT |            URL            |
|-----------|---------|-------------|---------------------------|
| default   | backend |          80 | http://192.168.49.2:30780 |
|-----------|---------|-------------|---------------------------|
🎉  Ouverture du service default/backend dans le navigateur par défaut...
```