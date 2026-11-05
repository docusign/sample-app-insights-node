FROM --platform=linux/amd64 node:26.12.1 AS base

RUN mkdir -p /home/vite/app
RUN npm config set cache /tmp --global

WORKDIR /home/vite/app
COPY .env ./
COPY ./package.json ./package-lock.json ./.npmrc ./
RUN npm ci

COPY . ./

RUN npm run build

# Run stage
FROM --platform=linux/amd64 nginx:1.27-alpine
COPY --from=base /home/vite/app/build /var/www/app
COPY ./infra/nginx/conf/ /etc/nginx/conf.d
EXPOSE 80 443
