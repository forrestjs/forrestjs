const fs = require('fs');
const path = require('path');

/**
 * Tries to source a configuration file using:
 * - fileName.development.json
 * - fileName.locale.json
 * - fileName.json
 * @param {String} configName
 * @param {String} basePath
 * @returns
 */
const loadConfigAsJSON = (configName, basePath, localSuffix) =>
  new Promise((resolve, reject) => {
    const envName = process.env.NODE_ENV || 'production';
    const configFileEnv = `${basePath}/${configName}.${envName}.json`;

    fs.readFile(configFileEnv, 'utf-8', (err, data) => {
      if (data) {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          // console.log(`Config file corrupted: ${configFileEnv}`);
          reject(err);
        } finally {
          return;
        }
      }

      if (err && err.code === 'ENOENT') {
        // console.log(`Config file not found: ${configFileEnv}`);
        const configFileLocale = `${basePath}/${configName}.${localSuffix}.json`;
        return fs.readFile(configFileLocale, 'utf-8', (err, data) => {
          if (data) {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              // console.log(`Config file corrupted: ${configFileLocale}`);
              reject(err);
            } finally {
              return;
            }
          }

          if (err && err.code === 'ENOENT') {
            // console.log(`Config file not found: ${configFileLocale}`);
            const configFile = `${basePath}/${configName}.json`;
            return fs.readFile(configFile, 'utf-8', (err, data) => {
              if (data) {
                try {
                  resolve(JSON.parse(data));
                } catch (err) {
                  // console.log(`Config file corrupted: ${configFile}`);
                  reject(err);
                } finally {
                  return;
                }
                return;
              }

              if (err && err.code === 'ENOENT') {
                // console.log(`Config file not found: ${configFile}`);
                resolve(null);
                return;
              }

              reject(err);
            });
          }

          reject(err);
        });
      }

      reject(err);
    });
  });

const serviceMeta = ({ registerTargets }) => {
  registerTargets({
    META_SOURCE: 'meta/source',
  });

  return [
    {
      target: '$INIT_SERVICE',
      handler: async ({ createExtension, getConfig, setContext }) => {
        const configPath = getConfig('meta.path', '/var/lib/meta');
        const localSuffix = getConfig('meta.local', 'local');

        // Source files from config and hooks:
        const jsonFiles1 = getConfig('meta.source', []);
        const jsonFiles2 = createExtension
          .sync('$META_SOURCE')
          .map(($) => $[0]);

        // Source each meta file and add it to the context:
        const jsonFiles = [...jsonFiles1, ...jsonFiles2];
        for (const fileName of jsonFiles) {
          const extName = path.extname(fileName);
          const keyName = fileName.substr(0, fileName.length - extName.length);

          switch (extName) {
            case '.json':
              const data = await loadConfigAsJSON(
                keyName,
                configPath,
                localSuffix,
              );
              setContext(`meta.${keyName}`, data);
              break;
            default:
              console.warn(`Meta format not (yet) supported: ${fileName}`);
          }
        }
      },
    },
  ];
};

module.exports = serviceMeta;
