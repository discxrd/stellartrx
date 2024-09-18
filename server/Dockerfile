# install deps
FROM node:21-alpine3.19 AS installer

WORKDIR /server

COPY package.json ./
COPY yarn.lock ./

COPY ./ ./

RUN yarn --silent

# builder
FROM node:21-alpine3.19 AS builder

WORKDIR /server

COPY package.json ./
COPY yarn.lock ./

COPY --from=installer /server/node_modules ./node_modules

COPY ./ ./

RUN yarn build

RUN yarn --silent --production && yarn cache clean

# runtime
FROM node:21-alpine3.19 AS production

WORKDIR /server

COPY --from=builder /server/node_modules ./node_modules
COPY --from=builder /server/dist ./dist

EXPOSE 3000

ENTRYPOINT ["node", "dist/main.js"]