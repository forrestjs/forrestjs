// https://sometimes-react.medium.com/jwks-and-node-jose-9273f89f9a02
// https://www.npmjs.com/package/node-jose
const jose = require('node-jose');
const jwt = require('jsonwebtoken');
const jwktopem = require('jwk-to-pem');
const ms = require('ms');
const path = require('path');
const fs = require('fs');

const DB_PATH_DEFAULT = '/var/lib/jwks/keys.json';

const service = {
  trace: __filename,
  name: 'jwks',
};

const loadPersistedKeys = (dbPath) =>
  new Promise((resolve, reject) => {
    fs.readFile(dbPath, 'utf-8', (err, data) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
        return;
      }

      resolve(data || null);
    });
  });

const persistKeys = (dbPath, keys, padding = null) =>
  new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(dbPath), { recursive: true }, (err) => {
      if (err) {
        reject(err);
        return;
      }

      fs.writeFile(
        dbPath,
        JSON.stringify(keys, null, padding),
        { encoding: 'utf-8' },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  });

const createNewKeyStore = async (dbPath, padding) => {
  const keyStore = jose.JWK.createKeyStore();

  await keyStore.generate('RSA', 2048, {
    alg: 'RS256',
    use: 'sig',
  });

  await persistKeys(dbPath, keyStore.toJSON(true), padding);
  return keyStore;
};

module.exports = () => {
  return [
    {
      ...service,
      priority: 10,
      target: '$INIT_SERVICE',
      handler: async ({ getConfig, setContext }) => {
        const dbPath = getConfig('jwks.serializer.db.path', DB_PATH_DEFAULT);
        const padding = getConfig(
          'jwks.serializer.padding',
          process.env.NODE_ENV === 'development' ? '  ' : '',
        );

        const keys = await loadPersistedKeys(dbPath);
        const keyStore = keys
          ? await jose.JWK.asKeyStore(keys)
          : await createNewKeyStore(dbPath, padding);

        const getPublicList = () => keyStore.toJSON();
        const getPublicPEMList = () => {
          const data = keyStore.toJSON();
          return {
            ...data,
            keys: data.keys.map((key) => ({
              kid: key.kid,
              pem: jwktopem(key),
            })),
          };
        };

        const getPublicPEM = (kid) => {
          const key = keyStore.all({ kid })[0].toJSON();
          return jwktopem(key);
        };

        const sign = (payload, useKey = null, options = {}) => {
          const key = useKey || keyStore.all({ use: 'sig' })[0];
          const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } };

          return jose.JWS.createSign(opt, key)
            .update(
              JSON.stringify({
                ...payload,
                // iat
                iat: options.issuedAt || Math.floor(Date.now() / 1000),
                // exp
                ...(options.expiresIn
                  ? {
                      exp: Math.floor(
                        (Date.now() + ms(options.expiresIn)) / 1000,
                      ),
                    }
                  : {}),
                // nbf
                ...(options.notBefore
                  ? {
                      nbf: Math.floor(
                        (Date.now() + ms(options.notBefore)) / 1000,
                      ),
                    }
                  : {}),
              }),
            )
            .final();
        };

        const verify = (token) => {
          const data = jwt.decode(token, { complete: true });
          const key = keyStore.all({ kid: data.header.kid })[0].toJSON();
          const publicKey = jwktopem(key);
          return jwt.verify(token, publicKey);
        };

        setContext('jwks', {
          keyStore,
          sign,
          verify,
          getPublicList,
          getPublicPEMList,
          getPublicPEM,
        });
      },
    },
    {
      ...service,
      target: '$START_SERVICE',
      handler: async ({ getContext, getConfig }) => {
        const dbPath = getConfig('jwks.serializer.db.path', DB_PATH_DEFAULT);
        const keyStore = getContext('jwks.keyStore');
        const padding = getConfig('jwks.serializer.padding', '');
        const rotateInterval = getConfig('jwks.rotate.interval', null);

        if (!rotateInterval) {
          console.log('[jwks] keys rotation is disabled');
          return;
        }

        const rotateKeys = async () => {
          console.log('[jwks] rotate keys');
          await keyStore.generate('RSA', 2048, {
            alg: 'RS256',
            use: 'sig',
          });

          const data = keyStore.toJSON();
          if (data.keys.length > 2) {
            const { kid } = data.keys[0];
            const key = keyStore.get(kid);
            keyStore.remove(key);
          }

          await persistKeys(dbPath, keyStore.toJSON(true), padding);
        };

        console.log(`[jwks] keys will rotate every ${rotateInterval}`);
        setInterval(rotateKeys, ms(rotateInterval));
      },
    },
    {
      ...service,
      target: '$FASTIFY_PLUGIN?',
      handler: ({ decorateRequest }, { getContext }) => {
        decorateRequest('jwks', getContext('jwks'));
      },
    },
  ];
};
