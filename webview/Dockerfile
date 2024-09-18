FROM node:21-alpine3.19 AS build

WORKDIR /webview

COPY . .

RUN yarn --silent && yarn build --production && yarn cache clean

FROM node:21-alpine3.19

WORKDIR /webview

COPY --from=build /webview/build /build

RUN yarn global add serve

EXPOSE 5000

ENTRYPOINT ["serve", "-s", "/build", "-l", "5000"]