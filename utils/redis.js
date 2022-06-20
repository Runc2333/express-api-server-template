const { createClient } = require("redis");

let client;
if (config.redis.enable) {
    const client_config = {
        url: `redis://${config.redis.host}:${config.redis.port}`,
    };
    if (config.redis.password) client_config.password = config.redis.password;
    client = createClient(client_config);
    client.on("error", (err) => logger.e(`Redis Client Error: ${err.stack}`));
}

module.exports = {
    get: (key) => {
        if (!client) {
            throw new Error("Redis is not enabled");
        }
        return new Promise((resolve, reject) => {
            client.get(key, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },
    set: (key, value) => {
        if (!client) {
            throw new Error("Redis is not enabled");
        }
        return new Promise((resolve, reject) => {
            client.set(key, value, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },
};