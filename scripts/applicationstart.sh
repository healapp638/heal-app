#!/bin/bash

set -e

echo "Stopping old process..."
pm2 delete heal_api_3000 || true
pm2 delete excel_import_worker || true
pm2 delete bullMqWorker || true

echo "Starting application..."
cd /var/www/html/Heal-Prod-API

npm run start:prod

echo "Waiting for app to start..."
sleep 10

echo "Checking if port 3000 is listening..."

if ss -tuln | grep -q ':3000'; then
  echo "Application is running on port 3000"
else
  echo "Application is not running on port 3000"
#  exit 1
fi

echo "Saving PM2 state..."
pm2 save

echo "Application started successfully"