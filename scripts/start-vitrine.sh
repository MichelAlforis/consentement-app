#!/bin/bash
# Lanceur PM2 pour ouiclair-vitrine
# serve v14 — le flag -p n'est pas reconnu correctement sous PM2
# On passe par ce wrapper pour garantir l'invocation correcte
exec /usr/bin/serve apps/vitrine/out --listen 3002 --single
