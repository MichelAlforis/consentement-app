#!/bin/bash
set -e
cd "$(dirname "$0")"
npm run vitrine:build
rsync -avz --delete -e "ssh -i ~/.ssh/id_rsa_hetzner" apps/vitrine/out/ root@159.69.108.234:/srv/ouiclair/vitrine/
echo "✓ ouiclair.com mis à jour"
