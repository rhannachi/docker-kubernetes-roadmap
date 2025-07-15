## Résumé des use cases de l’application

### 1. GET `/favorites` – Consultation de la liste des favoris

- L’utilisateur peut récupérer la liste complète de ses favoris enregistrés dans la base de données.
- Chaque favori contient un titre (`title`) et un contenu/descriptif (`body`).


### 2. POST `/favorites` – Ajout d’un favori

- L’utilisateur peut ajouter un nouveau favori en envoyant un objet avec les propriétés `title` et `body`.
- Lors de l’ajout, l’application vérifie que le titre du favori n’existe pas déjà ; sinon, elle retourne une erreur.
- En cas de succès, le favori est enregistré en base et la réponse inclut l’objet créé.


### 3. GET `/todos` – Consultation de la liste des todos (externe)

- L’utilisateur accède à une liste de tâches (« todos ») récupérée depuis l’API externe [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos).
- La route retourne la liste brute des todos (format JSON).


### 4. GET `/users` – Consultation de la liste des utilisateurs (externe)

- L’utilisateur accède à une liste d’utilisateurs extraite de l’API [JSONPlaceholder](https://jsonplaceholder.typicode.com/users).
- La route retourne la liste complète des utilisateurs (format JSON).

