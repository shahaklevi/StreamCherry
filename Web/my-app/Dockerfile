# Web/my-app/Dockerfile

FROM node:18

WORKDIR /usr/src/web

COPY ./package*.json ./
RUN npm install

COPY . .
EXPOSE 3002

CMD ["npm", "start"]
