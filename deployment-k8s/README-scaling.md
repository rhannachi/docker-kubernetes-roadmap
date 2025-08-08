## Scaling

Après avoir exposé le port du conteneur et lancé notre application web, on essayera de consulter l'URL `http://192.168.49.2:32259/error` qui pointe directement vers cette partie du code Node.js :

```js 
app.get('/error', (req, res) => {
  process.exit(1);
});
```

`process.exit(1)` fait crasher notre application Node et empêche la commande `node app.js` de continuer à s'exécuter.

Pour consulter l'état des pods de notre cluster :

```
$ kubectl get pods
NAME                         READY   STATUS   RESTARTS      AGE
first-app-645bff6b5c-mxw8k   0/1     Error    4 (21s ago)   23h
```

Dans STATUS on a l'état ERROR qui indique que notre pod est hors fonctionnement.
Après quelques secondes, le ReplicaSet intervient pour relancer le pod qui a crashé.
Comme on a déjà précisé, le ReplicaSet se charge de relancer les pods qui crashent pour garantir que le nombre de pods prédéfini tournent avec succès.

```
$ kubectl get pods
NAME                         READY   STATUS    RESTARTS      AGE
first-app-645bff6b5c-mxw8k   1/1     Running   5 (93s ago)   23h
```

Maintenant, au lieu d'avoir un seul pod qui tourne, on peut choisir de faire tourner 4 pods :

``` 
$ kubectl scale deployment/first-app --replicas=4
```

Afficher la liste des pods :

```
$ kubectl get pods
NAME                         READY   STATUS    RESTARTS       AGE
first-app-645bff6b5c-gfz2s   1/1     Running   0              27s
first-app-645bff6b5c-mxw8k   1/1     Running   5 (6m5s ago)   23h
first-app-645bff6b5c-vdzgh   1/1     Running   0              27s
first-app-645bff6b5c-x56t9   1/1     Running   0              27s
```

À chaque fois qu'un pod crashe, un autre pod va prendre le relais et maintenir l'application toujours en état UP.



