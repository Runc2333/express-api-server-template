let knex;
if (config.database.enable) {
    knex = require('knex')({
        client: config.database.client,
        connection: {
            host: config.database.config[config.database.client].host,
            user: config.database.config[config.database.client].user,
            password: config.database.config[config.database.client].password,
            database: config.database.config[config.database.client].database,
        }
    });
} else {
    knex = () => {
        logger.e('Database is disabled but still being called while running.\nForcing program to stop...');
        process.exit(-1);
    }
}

module.exports = knex;