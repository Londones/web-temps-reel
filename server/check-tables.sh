#!/bin/bash

if [ ! -f /app/tables.lock ]; then
  echo "Syncing tables..."
  node ./scripts/synctables.js
  touch /app/tables.lock
else
  echo "Tables already run"
fi