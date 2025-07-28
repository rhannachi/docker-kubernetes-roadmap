FROM php:8.2.4-fpm-alpine

WORKDIR /var/www/html

RUN docker-php-ext-install pdo pdo_mysql

# Création du groupe et de l'utilisateur 'laravel' avec UID et GID à 1000
# Cette valeur (1000) correspond généralement au premier utilisateur « normal » , pour éviter d'utiliser l'utilisateur root
RUN addgroup -g 1000 laravel && adduser -G laravel -g laravel -s /bin/sh -D laravel

USER laravel
