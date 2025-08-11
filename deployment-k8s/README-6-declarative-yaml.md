## Approche Déclarative

L’approche déclarative consiste à créer un fichier de configuration YAML décrivant l’état souhaité de notre ressource Kubernetes, plutôt que de tout exécuter directement via l’invite de commande.

Cela permet de versionner, réutiliser et modifier facilement la configuration sans devoir retaper les commandes manuellement.

➡️ Consultez le fichier deployment.yaml pour voir un exemple complet de déclaration d’un Deployment.

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