## Env


```
    k8s-env.yaml :
    
    volumeMounts:
        - mountPath: /app/fff # chemin à l'intérieur du conteneur où le volume sera monté
          name: story-volume    # nom du volume déclaré dans la section "volumes"
    env:
        # Déclare une variable d'environnement appelée STORY_FOLDER
        # Cette variable sera injectée dans le conteneur et accessible via "process.env?.STORY_FOLDER"
        - name: STORY_FOLDER
        # 'value' fixe ici la valeur de la variable à "fff"
        value: 'fff'
```

#### Note: 
-  il n’est pas possible de rendre `mountPath` dynamique directement via une variable d’environnement dans la définition du Pod ou du Deployment YAML.

![](./images/image-env.png)

