global.config = {
    server: {
        port: 3000
    },
    log: {
        level: 'info', // debug info warn error
        path: './server.log'
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
}