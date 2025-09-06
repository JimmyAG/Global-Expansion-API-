#!/bin/sh
set -e

echo "Waiting for MongoDB..."
until nc -z expanders360_mongodb 27017; do
  sleep 1
done

echo "Waiting for MySQL..."
until nc -z expanders360_mysql 3306; do
  sleep 1
done

echo "Waiting for Redis..."
until nc -z redis 6379; do
  sleep 1
done

echo "Running db migration"
npm run typeorm:migration:run

echo "Running seed script..."
npm run seed -- -v 200 -c 500 -s -d

echo "Starting NestJS app..."
exec npm run start:dev 
