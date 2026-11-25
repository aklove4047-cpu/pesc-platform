#!/usr/bin/env bash
# ==============================================================================
# PES Council Platform - AWS EC2 (Ubuntu 24.04) 1-Click Automated Deployment Script
# ==============================================================================
# Features:
# 1. Installs Node.js 22 LTS (with native node:sqlite support)
# 2. Installs PM2 process manager and configures systemd auto-restart
# 3. Configures Nginx reverse proxy with wildcard subdomain (*.pescouncil.in)
# 4. Configures permanent SQLite database path (/var/www/pesc-platform/data/pesc.db)
# 5. Future code updates with 'git pull' NEVER touch database data!
# ==============================================================================

set -e

echo "=========================================================="
echo "   PES COUNCIL PLATFORM - AWS EC2 DEPLOYMENT SCRIPT       "
echo "=========================================================="

# Check root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root or with sudo: sudo bash scripts/aws_setup.sh"
  exit 1
fi

echo "📦 [1/6] Updating Ubuntu system packages..."
apt-get update -y
apt-get install -y curl git build-essential nginx certbot python3-certbot-nginx ufw

echo "🟢 [2/6] Installing Node.js 22 LTS..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "⚡ [3/6] Installing PM2 process manager..."
npm install -g pm2

# Deploy directory
APP_DIR="/var/www/pesc-platform"
echo "📁 [4/6] Setting up project directory at $APP_DIR..."

if [ ! -d "$APP_DIR" ]; then
  echo "Cloning repository from GitHub..."
  git clone https://github.com/aklove4047-cpu/pesc-platform.git "$APP_DIR"
else
  echo "Directory exists, pulling latest updates..."
  cd "$APP_DIR"
  git pull origin main || true
fi

cd "$APP_DIR"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install --omit=dev

# Ensure persistent data directory exists
mkdir -p "$APP_DIR/data"
chmod -R 775 "$APP_DIR/data"

# Setup default .env if missing
if [ ! -f "$APP_DIR/.env" ]; then
  echo "Creating production .env file..."
  cat << 'EOF' > "$APP_DIR/.env"
NODE_ENV=production
PORT=3000
BASE_DOMAIN=pescouncil.in
SESSION_SECRET=pesc_production_secret_key_2026_super_secure
DB_FILE=/var/www/pesc-platform/data/pesc.db
EOF
fi

echo "🌐 [5/6] Configuring Nginx for pescouncil.in and *.pescouncil.in..."
cat << 'EOF' > /etc/nginx/sites-available/pescouncil.conf
server {
    listen 80;
    listen [::]:80;
    server_name pescouncil.in *.pescouncil.in;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }
}
EOF

ln -sf /etc/nginx/sites-available/pescouncil.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx and restart
nginx -t
systemctl restart nginx
systemctl enable nginx

echo "🚀 [6/6] Launching PES Council application with PM2..."
pm2 delete pesc 2>/dev/null || true
pm2 start src/server.js --name "pesc" -i max
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "🔒 Configuring UFW Firewall (Ports 22, 80, 443)..."
ufw allow 22/tcp || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true

echo "=========================================================="
echo "✅ DEPLOYMENT COMPLETE SUCCESSFULLY!"
echo "=========================================================="
echo "📍 App Path: $APP_DIR"
echo "💾 Database: $APP_DIR/data/pesc.db (PERMANENTLY SAVED ON SSD)"
echo "📊 PM2 Status:"
pm2 status
echo "=========================================================="
echo "💡 NEXT STEPS:"
echo "1. Point your domain (A Record) in Cloudflare DNS to this AWS Public IP."
echo "2. Whenever you push code updates to GitHub, just run:"
echo "   cd /var/www/pesc-platform && git pull origin main && pm2 reload pesc"
echo "   (Your SQLite database data in data/pesc.db will NEVER be touched!)"
echo "=========================================================="
