FROM --platform=linux/amd64 node:22.23.4 AS base

WORKDIR /usr/src/app

COPY package*.json .npmrc ./

RUN npm install

COPY . .

# Run stage
FROM --platform=linux/amd64 node:22.23.4-alpine

COPY --from=base /usr/src/app /usr/src/app
WORKDIR /usr/src/app
EXPOSE 8080

CMD ["npm", "start"]