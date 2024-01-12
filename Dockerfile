
FROM node:latest

ARG DATABASE_URL
ARG PORT

ENV PORT=$PORT
ENV DATABASE_URL=$DATABASE_URL



WORKDIR /usr/src/api

COPY package.json ./
RUN npm install


COPY . .
RUN npm i -g prisma
RUN prisma generate


RUN npm run prisma:generate
RUN npm run build

CMD ["npm", "start"]