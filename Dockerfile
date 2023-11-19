FROM node:16-alpine AS builder

WORKDIR /app

COPY front-end/package.json ./
COPY front-end/public/ public/
COPY front-end/src/ src/
RUN npm i --legacy-peer-deps
RUN npm run build

EXPOSE 3000

ENV REACT_APP_API_URL="http://jswntreports.com"

CMD ["npm","start"]