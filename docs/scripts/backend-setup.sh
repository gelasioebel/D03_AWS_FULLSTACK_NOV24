#!/bin/bash
# Backend setup script for Plants API
# This script prepares the EC2 environment for the Node.js backend

# Exit on any error
set -e

echo "🌱 Setting up Plants API backend..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js via NVM
echo "🟢 Installing Node.js via NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 18
nvm use 18
nvm alias default 18

# Verify Node.js installation
echo "✅ Node.js installation:"
node --version
npm --version

# Install PM2 globally
echo "🔄 Installing PM2 process manager..."
npm install -g pm2

# Install required system dependencies for better-sqlite3
echo "🧰 Installing system dependencies for SQLite..."
sudo yum install -y gcc gcc-c++ make

# Create application directory structure
echo "📁 Creating application directory structure..."
mkdir -p ~/app/database
chmod 777 ~/app/database

# Configure PM2 to start on system boot
echo "🚀 Configuring PM2 startup..."
pm2 startup
# The command above will output another command - you need to run that command manually

echo "✅ Backend environment setup complete!"
echo "Next steps:"
echo "1. Clone your repository or deploy your application files"
echo "2. Run 'npm install' in the app directory"
echo "3. Start your application with PM2: pm2 start server.ts --name 'plants-api' --interpreter ./node_modules/.bin/ts-node"
