## Updating Deployments

Dans notre code app.js, ajouter ces modifications `<h2>!!! Hola is new version !!!</h2>` :

```js 
app.get('/', (req, res) => {
    res.send(`
    <h1>Hello from this NodeJS app!</h1>
    <h2>!!! Hola is new version !!!</h2>
    <p>Try sending a request to /error and see what happens</p>
  `);
});
```

``` 
$ docker build -t rhannachi1991/first-app-k8s:1.0.0 .
$ docker login
$ docker push rhannachi1991/first-app-k8s:1.0.0
```

C'est important ici qu'à chaque modification apportée au code, il faut tagger l'image avec un tag spécifique pour que Kubernetes arrive à prendre en considération les nouveaux changements.

Après avoir publié sur DockerHub une nouvelle version de notre image, il faut que notre cluster la prenne en compte.

Il faut identifier le nom du conteneur dont on veut mettre l'image à jour.
Il suffit de consulter le Kubernetes dashboard puis le conteneur de notre Pod qui est en train de tourner.

![](./images/img.png)

On peut le faire aussi depuis la ligne de commande :

```
$ kubectl get deployment
NAME        READY   UP-TO-DATE   AVAILABLE   AGE
first-app   4/4     4            4           24h
```

Puis à partir du nom du deployment `first-app`, récupérer le nom du conteneur :

``` 
$ kubectl get deployment first-app -o jsonpath='{.spec.template.spec.containers[*].name}'
first-app-k8s
```

Donc il faut mettre à jour le conteneur `first-app-k8s` avec la nouvelle image `rhannachi1991/first-app-k8s:1.0.0`

``` 
$ kubectl set image deployment/first-app first-app-k8s=rhannachi1991/first-app-k8s:1.0.0
```

On peut suivre l'état de l'avancement du nouveau déploiement à travers cette commande :

```
$ kubectl rollout status deployment/first-app
Waiting for deployment "first-app" rollout to finish: 2 out of 4 new replicas have been updated...
Waiting for deployment "first-app" rollout to finish: 2 out of 4 new replicas have been updated...
Waiting for deployment "first-app" rollout to finish: 2 out of 4 new replicas have been updated...
Waiting for deployment "first-app" rollout to finish: 2 out of 4 new replicas have been updated...
Waiting for deployment "first-app" rollout to finish: 3 out of 4 new replicas have been updated...
Waiting for deployment "first-app" rollout to finish: 3 out of 4 new replicas have been updated...
Waiting for deployment "first-app" rollout to finish: 3 out of 4 new replicas have been updated...
Waiting for deployment "first-app" rollout to finish: 3 out of 4 new replicas have been updated...
Waiting for deployment "first-app" rollout to finish: 3 out of 4 new replicas have been updated...
Waiting for deployment "first-app" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "first-app" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "first-app" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "first-app" rollout to finish: 3 of 4 updated replicas are available...
deployment "first-app" successfully rolled out
```

![](./images/img2.png)

