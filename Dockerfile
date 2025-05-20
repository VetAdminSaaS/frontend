# Etapa de build
FROM node:24-slim AS build

WORKDIR /app


COPY package*.json ./
RUN npm install


COPY . .


RUN npm run build -- --configuration production

# Etapa de producción
FROM nginx:alpine


COPY --from=build /app/dist/factus-frontend /usr/share/nginx/html


COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
