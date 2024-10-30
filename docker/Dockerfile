FROM node:20-bullseye-slim

# create app directory
RUN npm i -g pnpm
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN pnpm ci
RUN pnpm run build