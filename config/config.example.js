global.config = {
    server: {
        port: 3000
    },
    log: {
        enable: true,
        console_level: 'trace', // Specific level will be output to console, can be trace debug info warn error
        log_level: 'trace', // Specific level will be write to file, can be trace debug info warn error
        folder: './log',
        log_split: true, // split log file by day
    },
    file: {
        maxUploadSize: '5', // megabyte
    },
    redis: { // use redis for session sharing between workers and avoiding session loss during restart
        enable: true,
        host: '',
        port: '',
        password: '',
    },
    database: {
        client: "mysql", // mysql or sqlite3
        mysql: {
            host: "",
            port: "",
            user: "",
            password: "",
            database: "",
        },
        sqlite3: {
            filename: "",
        }
    }
};