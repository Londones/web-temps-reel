#!/bin/bash

if [ ! -f /app/seed.lock ]; then
  echo "Running seeds..."
  npx sequelize-cli db:seed:all
  touch /app/seed.lock
else
  echo "Seeds already run"
fi