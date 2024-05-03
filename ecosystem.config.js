module.exports = {
  apps: [
    {
      name: 'analytics-api',
      script: './dist/main.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      autorestart: true,
      restart_delay: 5000, // ms
    },
  ],
};
