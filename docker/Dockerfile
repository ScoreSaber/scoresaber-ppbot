FROM node:20-bullseye-slim

# create app directory
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install
RUN npm run build