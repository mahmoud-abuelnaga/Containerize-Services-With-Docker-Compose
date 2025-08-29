FROM node:current-alpine AS base
WORKDIR /app
COPY package*.json .

FROM base AS development
RUN npm ci
COPY . .

ENTRYPOINT [ "npm" ]
CMD [ "run", "dev" ]

FROM base AS production-build
RUN npm install -g @vercel/ncc

RUN npm ci --only=production
COPY . .

RUN npm run build

FROM gcr.io/distroless/nodejs24-debian12 AS production
WORKDIR /app
COPY --from=production-build /app/build/index.js index.js

CMD [ "index.js" ]
