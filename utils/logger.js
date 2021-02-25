const dateformat = require("dateformat");
const fs = require("fs-extra");

var d = (msg) => {
    msg.toString().split('\n').forEach((line) => {
        console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[40;97m"}[DEBUG]${"\033[0m"} ${line}`);
        fs.appendFile(config.log.path, `[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [DEBUG] ${line}\n`);
    });
}

var i = (msg) => {
    msg.toString().split('\n').forEach((line) => {
        console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [INFO] ${line}`);
        fs.appendFile(config.log.path, `[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [INFO] ${line}\n`);
    });
}

var w = (msg) => {
    msg.toString().split('\n').forEach((line) => {
        console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[44;97m"}[WARN]${"\033[0m"} ${line}`);
        fs.appendFile(config.log.path, `[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [WARN] ${line}\n`);
    });
}

var e = (msg) => {
    msg.toString().split('\n').forEach((line) => {
        console.log(`[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] ${"\033[41;97m"}[ERROR]${"\033[0m"} ${line}`);
        fs.appendFile(config.log.path, `[${dateformat((new Date()), 'yyyy-mm-dd HH:MM:ss')}] [ERROR] ${line}\n`);
    });
}

// Alias
var debug = d, info = i, warn = w, error = e;

// Overwrite
if (/^(info|warn|error)$/.test(config.log.level)) d = debug = msg => false;
if (/^(warn|error)$/.test(config.log.level)) i = info = msg => false;
if (/^(error)$/.test(config.log.level)) w = warn = msg => false;

module.exports = {
    d,
    debug,
    i,
    info,
    w,
    warn,
    e,
    error,
}