FROM node:16-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm ci
CMD ["npm", "run", "dev"]