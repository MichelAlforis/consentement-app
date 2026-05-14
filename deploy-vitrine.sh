#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "→ Push vers GitHub..."
git push origin main

echo "→ Déploiement sur le serveur..."
ssh -i ~/.ssh/id_rsa_hetzner root@159.69.108.234 << 'EOF'
set -e
cd /srv/ouiclair/src

git pull origin main

npm install --silent

cd apps/vitrine
/srv/ouiclair/src/node_modules/.bin/next build
cd /srv/ouiclair/src

cp -r apps/vitrine/out/. /srv/ouiclair/vitrine/

echo "✓ ouiclair.com mis à jour"
EOF
