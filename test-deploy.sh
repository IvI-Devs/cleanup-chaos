#!/bin/bash

# Script to test deployment without actually uploading
# Use this to verify everything works before the real deployment
# 
# IMPORTANT: This script is for project administrators only!

# Load configuration from .butler.toml
CHANNEL="html5"  # Channel for web version
VERSION=$(date +"%Y.%m.%d-%H%M%S")  # Version based on date/time

# Extract user and game name from .butler.toml
if [ -f ".butler.toml" ]; then
    ITCH_USER=$(grep "user = " .butler.toml | sed 's/user = "\(.*\)"/\1/' | tr -d '"')
    GAME_NAME=$(grep "game = " .butler.toml | sed 's/game = "\(.*\)"/\1/' | tr -d '"')
fi

echo "🧪 Testing Cleanup Chaos deployment..."
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

# Step 2: Dry run (simulation without upload)
echo "🔍 Simulating upload to itch.io..."
butler validate public

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Files are valid for deployment!"
    echo "📝 To deploy for real, use: butler push public $ITCH_USER/$GAME_NAME:$CHANNEL --userversion $VERSION"
    echo "Or simply run: npm run deploy"
else
    echo "❌ Error in file validation"
    exit 1
fi
