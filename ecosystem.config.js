// PM2 ecosystem — Ouiclair services
// Déploiement sur i7 : /srv/ouiclair/
// CRM Alforis tourne sous Docker, Ouiclair tourne sous PM2 (séparation totale)

module.exports = {
  apps: [
    {
      name: 'ouiclair-vitrine',
      script: 'serve',
      args: '-s apps/vitrine/out -p 3002',
      cwd: '/srv/ouiclair',
      interpreter: 'none',
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'ouiclair-pocketbase',
      script: '/srv/ouiclair/pocketbase',
      args: 'serve --http=127.0.0.1:8092 --dir=/srv/ouiclair/pb-data --migrationsDir=/srv/ouiclair/pb_migrations',
      cwd: '/srv/ouiclair',
      interpreter: 'none',
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
