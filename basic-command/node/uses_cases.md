## Résumé des uses cases de l’application

#### 1. Affichage de la page d’accueil (objectif du cours)

- **URL** : `/`
- **Description** :
  L’utilisateur accède à la page principale, voit l’objectif du cours actuel (par défaut : "Learn Docker!") et un formulaire pour définir un nouvel objectif.


#### 2. Modification de l’objectif du cours

- **URL** : `/store-goal` (méthode POST)
- **Description** :
  L’utilisateur saisit un nouvel objectif dans le formulaire et le soumet.
    - L’objectif saisi est enregistré côté serveur (en mémoire).
    - L’utilisateur est redirigé vers la page d’accueil, où le nouvel objectif s’affiche.
