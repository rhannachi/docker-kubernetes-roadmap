FROM composer:2.5.7

WORKDIR /var/www/html

# Création du groupe et de l'utilisateur 'laravel' avec UID et GID à 1000
# Cette valeur (1000) correspond généralement au premier utilisateur « normal » , pour éviter d'utiliser l'utilisateur root
RUN addgroup -g 1000 laravel && adduser -G laravel -g laravel -s /bin/sh -D laravel

USER laravel

ENTRYPOINT ["composer", "--ignore-platform-reqs"]
