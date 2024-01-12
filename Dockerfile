
FROM node:latest

ARG DATABASE_URL
ARG PORT

ENV PORT=$PORT
ENV DATABASE_URL=$DATABASE_URL



WORKDIR /usr/src/api

COPY package.json ./

RUN npm install
COPY . .

RUN npm run build

RUN npm run start