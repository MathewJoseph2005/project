#!/bin/bash
# Production startup script for Pac-Man Arena

# Build frontend
echo "Building frontend..."
npm run build

# Navigate to server
cd server || exit 1

# Install dependencies
echo "Installing server dependencies..."
npm install

# Set production environment and start
echo "Starting server in production mode..."
NODE_ENV=production node server.js
