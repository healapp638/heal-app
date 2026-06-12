#!/bin/bash
APP_DIR="/var/www/html/Heal-Prod-API"

if [ -d "$APP_DIR" ]; then
  echo "Removing old app files except node_modules"
  find "$APP_DIR" -mindepth 1 \
    ! -name "node_modules" \
    ! -path "$APP_DIR/node_modules/*" \
    -exec rm -rf {} +
else
  echo "Directory does not exist"
fi