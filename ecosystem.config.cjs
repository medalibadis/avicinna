module.exports = {
  apps: [
    {
      name: "avicinna-production",
      script: ".next/standalone/server.js",
      instances: 2,
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "750M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0"
      }
    }
  ]
};
