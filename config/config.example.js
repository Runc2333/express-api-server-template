global.config = {
    server: {
        port: 3000,
        trusted_proxies: ["loopback", "linklocal", "uniquelocal"],
    },
    log: {
        enable: true,
        console_level: "trace", // Specific level will be output to console, can be trace debug info warn error
        log_level: "trace", // Specific level will be write to file, can be trace debug info warn error
        folder: "./log",
        log_split: true, // split log file by day
    },
    file: {
        maxUploadSize: "5", // megabyte
    },
    session: {
        secret: "RYTZt8nq5fScH4w2", // Replace with your own secret
    },
    redis: { // use redis for session sharing between workers and avoiding session loss during restart
        enable: false,
        host: "",
        port: "",
        password: "",
    },
    database: {
        enable: false,
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
        },
    },
};