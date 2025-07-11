## Résumé des uses cases de l’application

#### 1. Affichage de la page d’accueil (formulaire de feedback)

- **URL** : `/`
- **Description** :
  L’utilisateur accède à la page principale, voit un formulaire pour soumettre un feedback (titre + texte).


#### 2. Soumission d’un feedback

- **URL** : `/create` (méthode POST)
- **Description** :
  L’utilisateur remplit le formulaire et soumet un feedback.
    - Si le titre n’existe pas encore, le feedback est enregistré.
    - Si le titre existe déjà, l’utilisateur est redirigé vers une page d’erreur.


#### 3. Gestion des doublons de feedback

- **URL** : `/exists`
- **Description** :
  Si un feedback avec le même titre existe déjà, l’utilisateur est informé via une page dédiée.


#### 4. Consultation des feedbacks existants

- **URL** : `/feedback/<nom-du-fichier>`
- **Description** :
  Les feedbacks enregistrés sont accessibles en lecture directe via cette URL (fichiers servis en statique).

---

## Dockerfile

