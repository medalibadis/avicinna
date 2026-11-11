const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const loaded = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) loaded[key] = value;
  }
  return loaded;
}

const prodEnv = loadEnvFile(path.join(__dirname, '.env.production'));

module.exports = {
  apps: [
    {
      name: 'avicinna-production',
      script: '.next/standalone/server.js',
      // Single-instance fork mode prevents concurrent-write conflicts on local
      // .avicinna-data/store.json and split in-memory rate-limiting counters.
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '750M',
      env: {
        ...prodEnv,
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
};
