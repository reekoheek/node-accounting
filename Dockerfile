FROM mhart/alpine-node:7.4.0

COPY . /app

RUN set -x \
  && apk add --no-cache git \
  && cd /app \
  && node -v && npm -v \
  && npm install && npm run build \
  && rm -rf node_modules && npm install --production

WORKDIR /app

CMD ["node", "--harmony-async-await", "server.js"]
