global.config = {
    server: {
        port: 3000
    },
    log: {
        enable: true,
        console_level: 'info', // Specific level will be output to console, can be trace debug info warn error
        log_level: 'warn', // Specific level will be write to file, can be trace debug info warn error
        folder: './log',
        log_split: true, // split log file by day
    },
    file: {
        maxUploadSize: '5', // megabyte
    },
    redis: { // use redis for session sharing between workers
        enable: true, // and avoiding session loss during restart
        host: '',
        port: '',
        password: '',
    },
    database: {
        enable: false,
        client: "mysql",
        config: {
            mysql: {
                host: "",
                user: "",
                password: "",
                database: "",
            },
            sqlite: {
                filename: "",
            },
        }
    }
};