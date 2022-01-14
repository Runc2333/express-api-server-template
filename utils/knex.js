let knex_config = {
    client: config.database.client,
};

switch (config.database.client) {
    case 'mysql': {
        knex_config.connection = `mysql://${config.database.mysql.user}:${config.database.mysql.password}@${config.database.mysql.host}:${config.database.mysql.port}/${config.database.mysql.database}?charset=utf8mb4`;
        break;
    }
    case 'sqlite3': {
        knex_config.connection = {
            filename: config.database.sqlite3.filename,
        };
        break;
    }
    default: {
        throw new Error('Unknown database client: ' + config.database.client);
    }
}

module.exports = require('knex')(knex_config);