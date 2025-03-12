FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

RUN if [ -f client_secret.json ]; then \
      cp client_secret.json /tmp/client_secret.json; \
    else \
      touch /tmp/client_secret.json; \
      echo "client_secret.json not found, created empty file"; \
    fi

FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY --from=builder /app/dist ./dist

COPY --from=builder /tmp/client_secret.json ./client_secret.json

CMD npm run typeorm migration:run -d dist/config/ormconfig.js && npm run start:prod