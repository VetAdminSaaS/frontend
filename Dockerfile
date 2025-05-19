# Etapa de build
FROM node:24-slim AS build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Construir el proyecto Angular (asegúrate del nombre del proyecto en angular.json)
RUN npm run build -- --configuration production

# Etapa de producción
FROM nginx:alpine

# Copiar archivos compilados al contenedor NGINX
COPY --from=build /app/dist/factus-frontend /usr/share/nginx/html

# Copiar configuración personalizada de NGINX (asegúrate de que nginx.conf esté en la raíz del proyecto)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
