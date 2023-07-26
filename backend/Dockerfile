FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY .env ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./

COPY prisma ./prisma
COPY src ./src

RUN yarn install
RUN npx prisma generate

EXPOSE 3000

# CMD yarn run prisma-deploy:test
CMD yarn run prisma-deploy && yarn run start