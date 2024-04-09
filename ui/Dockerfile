FROM node:20.12 as build
WORKDIR /app
COPY ./esbuild/esbuild.common.js ./esbuild/esbuild.prod.js /app/esbuild/
COPY ./package.json ./package-lock.json /app
RUN npm ci
COPY ./src /app/src
COPY ./static /app/static
RUN npm run prod

FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/build .
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/templates/ /etc/nginx/templates/