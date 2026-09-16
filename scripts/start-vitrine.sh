#!/bin/bash
# Lanceur PM2 pour ouiclair-vitrine
# serve v14 — le flag -p n'est pas reconnu correctement sous PM2
# On passe par ce wrapper pour garantir l'invocation correcte
# (pas de --single : c'est un export multi-pages, --single casse le routage des sous-pages)
exec /usr/bin/serve apps/vitrine/out --listen 3002
