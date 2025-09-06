FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY docker-db-prepare.sh ./ 

RUN chmod +x docker-db-prepare.sh

EXPOSE 3000

CMD ["./docker-db-prepare.sh"]
