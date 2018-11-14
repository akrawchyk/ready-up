module.exports = {
  apps: [
    {
      name: 'ready-up-api',
      cwd: './packages/ready-up-api',
      script: 'index.js',

      instances: 1,
      autorestart: true,
      watch: [
        './**/*.js',
        '../fastify-ready-up/**/*.js',
        '../ready-up-pg-connector/**/*.js',
        '../ready-up-sdk/**/.js'
      ],
      ignore_watch: '**/node_modules/**',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },

      env_development: {
        DEBUG: 'knex:query',
        READY_UP_SSL_CERT_PATH: '/home/andrew/tmp/ssl/ready-up.test.crt',
        READY_UP_SSL_KEY_PATH: '/home/andrew/tmp/ssl/ready-up.test.key',
        READY_UP_ALLOWED_ORIGINS: ['https://ready-up.test:8080', 'https://ready-up.test:8000'].join(
          ','
        ),
        READY_UP_LISTEN_ADDRESS: '0.0.0.0',
        READY_UP_LISTEN_PORT: 3000,
        READY_UP_PG_CONNECTION_STRING: 'postgresql://postgres@localhost/ready-up',
        READY_UP_SESSION_SECRET_KEY_PATH: '/home/andrew/tmp/ready-up-session-secret-key',
        READY_UP_FIREBASE_SERVICE_ACCOUNT_KEY_PATH:
          '/home/andrew/tmp/ready-up-f1555-firebase-adminsdk-wxb67-632d601424.json',
        READY_UP_FIREBASE_MESSAGING_SENDER_ID: '751484056905',
        READY_UP_MAX_SESSION_MS: 1000 * 60 * 20 // 20 minutes
      },

      env_production: {
        NODE_ENV: 'production'
      }
    },

    {
      name: 'ready-up-web',
      cwd: './packages/ready-up-web/dist',
      script: '../bin/server',

      instances: 1,
      autorestart: true,
      watch: ['./dist/**'],
      env_development: {
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
