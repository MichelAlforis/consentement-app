#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "→ Push vers GitHub..."
git push origin main

echo "→ Déploiement sur le serveur (i7)..."
ssh -i ~/.ssh/id_ed25519_hetzner_v2 michel@192.168.1.200 << 'EOF'
set -e
cd /srv/ouiclair

git pull origin main

pnpm install --silent

cd apps/vitrine
pnpm exec next build

echo "✓ ouiclair.com mis à jour (servi en place par PM2 depuis apps/vitrine/out)"
EOF
