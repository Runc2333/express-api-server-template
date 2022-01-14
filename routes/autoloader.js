const fs = require('fs-extra');
const path = require('path');
const express = require('express');
let router = express.Router();

let registered_paths = [];

const handle_file = (item, path_prefix) => {
    if (item.name.endsWith('.js')) {
        let api_name = item.name.split('.')[0];
        let api_path;
        if (api_name === 'index') {
            api_path = path_prefix;
        } else {
            api_path = (path_prefix + api_name).replace(/\/*$/g, '/');
        }
        let configuration;
        try {
            configuration = require(path.join(__dirname, path_prefix, item.name));
        } catch (e) {
            throw new Error(`Failed to load ${path.join(__dirname, path_prefix, item.name)}: ${e.stack}`);
        }
        for (let { method, handler } of configuration) {
            if (typeof method !== 'string') throw new Error(`Failed to load ${path.join(__dirname, path_prefix, item.name)}: Method must be a string, but got ${typeof method}`);
            if (typeof handler !== 'function') throw new Error(`Failed to load ${path.join(__dirname, path_prefix, item.name)}: Handler must be a function, but got ${typeof handler}`);
            let method_path = `${method.toUpperCase()} ${api_path}`;
            if (!registered_paths.includes(method_path)) {
                registered_paths.push(method_path);
                router[method.toLowerCase()](api_path, handler);
                logger.d(`${method_path} => ${path.join(__dirname, path_prefix, item.name)}`);
            } else {
                throw new Error(`Failed to load ${path.join(__dirname, path_prefix, item.name)}: ${method_path} is already registered`);
            }
        }
    }
};

const handle_directory = (item, path_prefix) => {
    let sub_path = path_prefix + item.name + '/';
    let sub_items = fs.readdirSync(path.join(__dirname, path_prefix, item.name), { withFileTypes: true });
    for (let sub_item of sub_items) {
        if (sub_item.isDirectory()) {
            handle_directory(sub_item, sub_path);
        } else {
            handle_file(sub_item, sub_path);
        }
    }
};

// Load all router scripts
let items = fs.readdirSync(path.join(__dirname), { withFileTypes: true });
for (let item of items) {
    if (item.isDirectory()) {
        handle_directory(item, '/');
    } else {
        if (item.name === 'autoloader.js') continue;
        handle_file(item, '/');
    }
}

module.exports = router;