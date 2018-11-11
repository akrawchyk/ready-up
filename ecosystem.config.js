module.exports = {
  apps: [
    {
      name: 'ready-up-api',
      script: 'packages/ready-up-api/index.js',
      cwd: 'packages/ready-up-api',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      autorestart: true,
      watch: [
        'packages/fastify-ready-up/**/*.js',
        'packages/ready-up-api/**/*.js',
        'packages/ready-up-pg-connector/**/*.js',
        'packages/ready-up-sdk/**/*.js'
      ],
      ignore_watch: '*node_modules*',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        DEBUG: 'knex:query',
        READY_UP_SSL_CERT_PATH: '/home/andrew/tmp/ssl/ready-up.test.crt',
        READY_UP_SSL_KEY_PATH: '/home/andrew/tmp/ssl/ready-up.test.key',
        READY_UP_ALLOWED_ORIGINS: 'https://ready-up.test:8080,https://ready-up.test:8000',
        READY_UP_LISTEN_ADDRESS: '0.0.0.0',
        READY_UP_LISTEN_PORT: 3000,
        READY_UP_PG_CONNECTION_STRING: 'postgresql://postgres@localhost/ready-up',
        READY_UP_SESSION_SECRET_KEY_PATH: '/home/andrew/tmp/ready-up-session-secret-key'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },

    {
      name: 'ready-up-web',
      cwd: 'packages/ready-up-web/dist',
      script: 'packages/ready-up-web/bin/server',

      instances: 1,
      autorestart: true,
      watch: ['packages/ready-up-web/dist/**/*'],
      env: {
        READY_UP_SSL_CERT_PATH: '/home/andrew/tmp/ssl/ready-up.test.crt',
        READY_UP_SSL_KEY_PATH: '/home/andrew/tmp/ssl/ready-up.test.key'
      }
    }
  ],

  deploy: {
    //   production : {
    //     user : 'node',
    //     host : '212.83.163.1',
    //     ref  : 'origin/master',
    //     repo : 'git@github.com:repo.git',
    //     path : '/var/www/production',
    //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    //   }
  }
}
