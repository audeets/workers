FROM node:20.10-alpine3.19
RUN npx puppeteer browsers install chrome
COPY . /usr/app
WORKDIR /usr/app
