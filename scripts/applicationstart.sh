#!/bin/bash

set -e

echo "Stopping old process..."
pm2 delete heal_api_3001 || true
pm2 delete excel_import_worker || true
pm2 delete bullMqWorker || true

echo "Starting application..."
cd /var/www/html/Heal-Dev-API

npm run start:dev

echo "Waiting for app to start..."
sleep 10

echo "Checking if port 3001 is listening..."

if ss -tuln | grep -q ':3001'; then
  echo "Application is running on port 3001"
else
  echo "Application is not running on port 3001"
#  exit 1
fi

echo "Saving PM2 state..."
pm2 save

echo "Application started successfully"