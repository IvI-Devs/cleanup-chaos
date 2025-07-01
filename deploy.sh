#!/bin/bash

# Script to build and upload the game to itch.io
# 
# IMPORTANT: This script is for project administrators only!
# Make sure you have:
# 1. Butler installed and authenticated (butler login)
# 2. .butler.toml configured with your credentials
# 3. Proper permissions to deploy this project

# Load configuration from .butler.toml
# These values will be read from your .butler.toml file automatically by butler
CHANNEL="html5"  # Channel for web version
VERSION=$(date +"%Y.%m.%d-%H%M%S")  # Version based on date/time

# Extract user and game name from .butler.toml
if [ -f ".butler.toml" ]; then
    ITCH_USER=$(grep "user = " .butler.toml | sed 's/user = "\(.*\)"/\1/' | tr -d '"')
    GAME_NAME=$(grep "game = " .butler.toml | sed 's/game = "\(.*\)"/\1/' | tr -d '"')
fi

echo "🚀 Starting Cleanup Chaos deployment..."
echo "📅 Version: $VERSION"
echo "👤 User: $ITCH_USER"
echo "🎮 Game: $GAME_NAME"
echo ""

# Check if .butler.toml exists and contains required configuration
if [ ! -f ".butler.toml" ]; then
    echo "❌ Error: .butler.toml not found!"
    echo "Please copy .butler.toml.template to .butler.toml and configure your credentials."
    exit 1
fi

if [ -z "$ITCH_USER" ] || [ -z "$GAME_NAME" ]; then
    echo "❌ Error: Could not read user or game name from .butler.toml"
    echo "Please ensure your .butler.toml file is properly configured."
    exit 1
fi

# Step 1: Clean and build the project
echo "🔨 Building the project..."
npm run build

# Verify that the build was successful
if [ ! -d "public" ]; then
    echo "❌ Error: 'public' directory not found. Build failed."
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 2: Upload to itch.io
echo "📤 Uploading to itch.io..."
butler push public $ITCH_USER/$GAME_NAME:$CHANNEL --userversion $VERSION

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "🌐 The game is available at: https://$ITCH_USER.itch.io/$GAME_NAME"
else
    echo "❌ Error during upload to itch.io"
    echo "Make sure you have proper permissions and credentials."
    exit 1
fi
