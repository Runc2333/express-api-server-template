global.processPath = process.cwd();
require(processPath + "/config/config"); // Avoiding package tools such as pkg pack the config.
require("./utils/autoloader");

const redis = require("redis");
const morgan = require("morgan");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const routerAutoloader = require("./routes/autoloader");

const app = express();

/* HTTP服务日志 */
app.use(morgan(function (tokens, req, res) {
    const string = [
        tokens["remote-addr"](req, res),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res), "-",
        tokens["response-time"](req, res), "ms",
    ].join(" ");
    logger.d(string);
    return;
}));

/* Express中间件 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* 文件上传 */
app.use(fileUpload({
    limits: { fileSize: config.file.max_upload_size * 1024 * 1024 },
}));

/* 可信代理 */
app.set("trust proxy", config.server.trusted_proxies);

/* Session */
if (config.redis.enable) {
    const RedisStore = require("connect-redis")(session);
    const redisClient = redis.createClient({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
    });
    app.use(session({
        proxy: true,
        store: new RedisStore({ client: redisClient }),
        secret: config.session.secret,
        resave: false,
        rolling: true,
        saveUninitialized: true,
        cookie: ("name", "value", { maxAge: 15 * 24 * 60 * 60 * 1000, secure: true, sameSite: "none" }),
    }));
} else {
    app.use(session({
        proxy: true,
        secret: config.session.secret,
        resave: false,
        rolling: true,
        saveUninitialized: true,
        cookie: ("name", "value", { maxAge: 15 * 24 * 60 * 60 * 1000, secure: true, sameSite: "none" }),
    }));
}

/* 所有返回格式都应为 JSON */
app.all("*", function (req, res, next) {
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

/* 注册路由 */
app.use("/", routerAutoloader);

/* 404 */
app.use((_req, res) => {
    stdrtn.not_found(res);
});

/* 异常处理 */
app.use((err, _req, res) => {
    logger.e(err);
    stdrtn.server_error(res);
});

/* 兜底策略: 捕获所有异常 */
// Catch uncaught exceptions.
process.on("uncaughtException", (err) => {
    logger.e(`Uncaught Exception: ${err.stack}`);
});

// Catch unhandled promise rejections.
process.on("unhandledRejection", (err) => {
    logger.e(`Unhandled Rejection: ${err.stack}`);
});

module.exports = app;