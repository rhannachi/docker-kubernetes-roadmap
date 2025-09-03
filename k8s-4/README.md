## Networking


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
- La communication entre «Users API» et «Auth API» se fait en interne, sans accès externe.

[k8s-users.yaml](./k8s-users.yaml)