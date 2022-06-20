const fs = require("fs-extra");
const path = require("path");

// Hack fs-extra module.
const append_to_log = (data) => {
    try {
        fs.ensureFileSync(path.join(
            config.log.folder,
            `${config.log.log_split ? tools.date_format(new Date(), true) : "server"}.log`,
        ));
    } catch (e) {
        throw new Error("Unable to create log file:" + e);
    }
    try {
        fs.appendFileSync(path.join(
            config.log.folder,
            `${config.log.log_split ? tools.date_format(new Date(), true) : "server"}.log`,
        ), data);
    } catch (e) {
        throw new Error("Unable to append log file:" + e);
    }
};

let t = (() => {
    const conditons = ["trace"];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] ${"\033[40;97m"}[TRACE]${"\033[0m"} ${line}`);
                append_to_log(`[${tools.date_format(new Date())}] [TRACE] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] ${"\033[40;97m"}[TRACE]${"\033[0m"} ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                append_to_log(`[${tools.date_format(new Date())}] [TRACE] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), trace = t;

let d = (() => {
    const conditons = ["trace", "debug"];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] ${"\033[40;97m"}[DEBUG]${"\033[0m"} ${line}`);
                append_to_log(`[${tools.date_format(new Date())}] [DEBUG] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] ${"\033[40;97m"}[DEBUG]${"\033[0m"} ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                append_to_log(`[${tools.date_format(new Date())}] [DEBUG] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), debug = d;

let i = (() => {
    const conditons = ["trace", "debug", "info"];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] [INFO] ${line}`);
                append_to_log(`[${tools.date_format(new Date())}] [INFO] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] [INFO] ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                append_to_log(`[${tools.date_format(new Date())}] [INFO] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), info = i;

let w = (() => {
    const conditons = ["trace", "debug", "info", "warn"];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] ${"\033[44;97m"}[WARN]${"\033[0m"} ${line}`);
                append_to_log(`[${tools.date_format(new Date())}] [WARN] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] ${"\033[44;97m"}[WARN]${"\033[0m"} ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                append_to_log(`[${tools.date_format(new Date())}] [WARN] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), warn = w;

let e = (() => {
    const conditons = ["trace", "debug", "info", "warn", "error"];
    if (conditons.includes(config.log.console_level) && conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] ${"\033[41;97m"}[ERROR]${"\033[0m"} ${line}`);
                append_to_log(`[${tools.date_format(new Date())}] [ERROR] ${line}\n`);
            });
        };
    } else if (conditons.includes(config.log.console_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                console.log(`[${tools.date_format(new Date())}] ${"\033[41;97m"}[ERROR]${"\033[0m"} ${line}`);
            });
        };
    } else if (conditons.includes(config.log.log_level)) {
        return (msg) => {
            String(msg).split("\n").forEach((line) => {
                append_to_log(`[${tools.date_format(new Date())}] [ERROR] ${line}\n`);
            });
        };
    } else {
        return () => { };
    }
})(), error = e;

if (!config.log.enable) {
    t = trace = d = debug = i = info = w = warn = e = error = () => { };
}

module.exports = {
    t: t,
    trace: trace,
    d: d,
    debug: debug,
    i: i,
    info: info,
    w: w,
    warn: warn,
    e: e,
    error: error,
};