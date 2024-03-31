FROM node:20.12
RUN npm run prod

FROM nginx:alpine
WORKDIR /app
COPY ./build .
COPY ./nginx.conf /etc/nginx/nginx.conf