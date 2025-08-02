```
$ docker build -t rhannachi1991/gols-node ./backend/
```

```
$ docker login
$ docker push rhannachi1991/gols-node:latest
```

### La création d'un cluster ECS AWS:
#### Configuration générale de la tâche
- **Nom de la famille de tâche :** Exemple : `goals-task`.
- **Type de lancement :** Sélectionnez **AWS Fargate** pour un déploiement serverless.
- **Rôles IAM :** Sélectionnez les rôles d’exécution adéquats (`ecsTaskExecutionRole`).

### Container 1
#### 1. Définir le conteneur principal
- **Nom du conteneur :** Par exemple, `goals-node`.
- **URI de l’image :** Spécifiez l’image Docker (ex : `rhamnachi1991/goals-node:latest`).
- **Conteneur essentiel :** Cochez "Oui" si c’est le conteneur principal.

#### 2. Mappage des ports
- **Port du conteneur :** Indiquez le port interne utilisé (ex : 80).
- **Protocole :** Généralement `TCP`.
- **Protocole de l’application :** Spécifiez le protocole applicatif, ici `HTTP`.

#### 3. Variables d’environnement
- Ajoutez les variables nécessaires comme :
    - `MONGODB_USERNAME`
    - `MONGODB_PASSWORD`
    - `MONGODB_URL`

#### 4. Configuration Docker (facultative)
- **Commande de lancement :** Par exemple, `node,app.js` pour démarrer l’application Node.js.

#### 5. Ordre des dépendances de démarrage :
- La condition de lancement choisie est Healthy. Cela signifie que le conteneur `goals-node` ne démarrera qu’une fois que le conteneur mongodb sera en état "sain". Cela garantit que l’application ne démarre qu’une fois la base MongoDB opérationnelle.

### Container 2
#### 1. Définir le conteneur principal
- **Nom du conteneur :** `mongodb`.
- **URI de l’image :** Spécifiez l’image Docker (`mongo`).
- **Conteneur essentiel :** Cochez "Oui" si c’est le conteneur principal.

#### 2. Mappage des ports
- **Port du conteneur :** Indiquez le port interne utilisé (27017).
- **Protocole :** Généralement `TCP`.

#### 3. Variables d’environnement
- Ajoutez les variables nécessaires comme :
    - `MONGO_INITDB_ROOT_USERNAME`
    - `MONGO_INITDB_ROOT_PASSWORD`
#### 4. Healthcheck
- `CMD-SHELL,mongosh --eval 'db.runCommand("ping").ok' --quiet` : Cette commande utilise le client mongosh pour exécuter la commande MongoDB ping. Elle vérifie que la base répond et fonctionne

![](./images/cluster-1.png)
![](./images/task-2.png)
![](./images/task-3.png)
![](./images/task-4.png)
![](./images/task-5.png)
![](./images/task-6.png)
![](./images/task-7.png)
![](./images/task-8.png)

### Ajouter un groupe de sécurité :
créer un groupe de sécurité `port-80-open-anywhere` avec les règles nécessaires pour autoriser le trafic entrant et sortant sur les ports requis `80`. 
Cela permettra d'accéder à notre cluster ECS depuis l'extérieur du réseau AWS.

![](./images/groupes-securite-1.png)
![](./images/groupes-securite-2.png)

### La création d'un service :

#### 1. Sélectionner la bonne définition de tâche
- Dans la section **Famille de définition de tâche**, choisis la définition de tâche que tu viens de créer (`goals-task`).
- Sélectionne la dernière révision de la définition de tâche (ex: Révision 1).
- Donne un **nom unique au service** (ex. : `goals-task-service-o48yssj9`).

#### 2. Environnement et options de calcul
- **Type de fournisseur de capacité** : Choisis `FARGATE`, qui est la meilleure option serverless pour lancer des tasks sans gérer d’EC2.
- Vérifie la version de plateforme (recommande : `LATEST`).
- Type de stratégie de planification : `Replica` (défini le nombre de tâches souhaitées à maintenir, ici : 1).

#### 3. Réglages réseau (Point critique souvent oublié)

- **VPC** : Vérifie que tu utilises le bon VPC (ici `vpc-34036f49`).
- **Sous-réseaux** : Sélectionne ceux qui couvrent tes zones de disponibilité pour assurer la haute disponibilité.
- **Groupes de sécurité** :
    - NE PAS utiliser seulement le groupe de sécurité par défaut.
    - **IL EST ESSENTIEL** d’ajouter explicitement le groupe de sécurité `port-80-open-anywhere` pour permettre l’accès HTTP sur le port 80 à tes tâches.
- **Adresse IP publique** : Active cette option si tu veux que la tâche soit accessible publiquement.

![](./images/service-1.png)
![](./images/service-2.png)
![](./images/service-3.png)
