/**
 * Extends `process.env` with informations from local files:
 *
 * .env
 * .env.local
 * .env.[development|production|...]
 * .env.[development|production|...].local
 *
 */

const path = require('path');
const fs = require('fs');
const nodeEnvFile = require('node-env-file');
const { getEnv } = require('./get-env');

const fileExists = (filePath) =>
  new Promise((resolve) => {
    fs.exists(filePath, (exists) => (exists ? resolve(true) : resolve(false)));
  });

const loadEnv = async (fileName, root, options) => {
  const filePath = path.join(root, fileName);
  if (await fileExists(filePath)) {
    nodeEnvFile(filePath, options);
  }
};

const initEnv = async (args, { setContext }) => {
  const cwd = args.cwd || process.cwd();
  await loadEnv('.env', cwd, { overwrite: false });
  await loadEnv('.env.local', cwd, { overwrite: true });
  await loadEnv(`.env.${process.env.NODE_ENV}`, cwd, { overwrite: true });
  await loadEnv(`.env.${process.env.NODE_ENV}.local`, cwd, { overwrite: true });

  // Decorate the context with an evironment variable getter
  setContext('getEnv', getEnv);
};

module.exports = { initEnv };
