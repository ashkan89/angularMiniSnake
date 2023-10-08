FROM node:16-alpine AS build
WORKDIR /app

COPY . .
RUN npm i -g @angular/cli@8.3.9
RUN npm install --legacy-peer-deps
RUN npm run build

# Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /app/dist/snake/ /usr/share/nginx/html
EXPOSE 80