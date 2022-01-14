const fs = require('fs-extra');

let files = fs.readdirSync(__dirname);
for (let file of files) {
    if (!/autoloader\.js/.test(file)) {
        global[file.split('.').shift()] = require(__dirname + `/${file}`);
    }
}