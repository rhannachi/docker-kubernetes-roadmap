FROM node:14-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Dans le cas d’une application front React (avec Create React App), il faut passer la variable d’environnement au moment de la build parce que
# Le front React est une application statique compilée lors du build (npm run build).
# Autoriser le passage d'un ARG pour la variable d'env REACT_APP_TASKS_API_URL
ARG REACT_APP_TASKS_API_URL
# Définir la variable d’environnement pour la build React
ENV REACT_APP_TASKS_API_URL=$REACT_APP_TASKS_API_URL

RUN npm run build

FROM nginx:1.19-alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]

