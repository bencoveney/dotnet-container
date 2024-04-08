FROM node:20.12 as build
WORKDIR /app
COPY package.json package-lock.json esbuild.common.js esbuild.prod.js /app
RUN npm ci
COPY ./src /app/src
COPY ./static /app/static
RUN npm run prod

FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/build .
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/templates/ /etc/nginx/templates/