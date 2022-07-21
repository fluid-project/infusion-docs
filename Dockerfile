FROM node:16.16.0-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git 

COPY package.json ./

RUN npm install

COPY . ./

RUN echo | npm run build


FROM nginx:1.18.0-alpine

COPY --from=builder /app/out /usr/share/nginx/html
