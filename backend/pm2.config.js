module.exports = {
  apps: [
    {
      name: 'backend',
      script: './dist/main.js',
      instances: 4,
      exec_mode: 'cluster',
      args: ['--websocket'],
    },
  ],
}
