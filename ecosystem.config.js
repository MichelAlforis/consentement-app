// PM2 ecosystem — Ouiclair services
// Déploiement sur i7 : /srv/ouiclair/
// CRM Alforis tourne sous Docker, Ouiclair tourne sous PM2 (séparation totale)

module.exports = {
  apps: [
    {
      name: 'ouiclair-vitrine',
      script: '/srv/ouiclair/scripts/start-vitrine.sh',
      interpreter: '/bin/bash',
      cwd: '/srv/ouiclair',
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'ouiclair-pocketbase',
      script: '/srv/ouiclair/pocketbase',
      // 0.0.0.0 : accessible depuis le LAN (téléphones à la maison), pas juste localhost.
      // Les collections carte_users / notre_carte_docs ont leurs propres règles d'accès.
      args: 'serve --http=0.0.0.0:8092 --dir=/srv/ouiclair/pb-data --migrationsDir=/srv/ouiclair/pb_migrations',
      cwd: '/srv/ouiclair',
      interpreter: 'none',
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
