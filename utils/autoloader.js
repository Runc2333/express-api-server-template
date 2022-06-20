const fs = require("fs-extra");

const files = fs.readdirSync(__dirname);
for (const file of files) {
    if (!/autoloader\.js/.test(file)) {
        global[file.split(".").shift()] = require(__dirname + `/${file}`);
    }
}