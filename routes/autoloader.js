const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const router = express.Router();

const registered_paths = [];

const handle_file = (item, path_prefix) => {
    if (item.name.endsWith(".js")) {
        const api_name = item.name.split(".").slice(0, -1).join(".").replace(/^_/, ":");
        const api_path = api_name === "index" ? path_prefix : (path_prefix + api_name).replace(/\/*$/g, "/");
        let configuration;
        try {
            configuration = require(path.join(__dirname, path_prefix, item.name));
        } catch (e) {
            throw new Error(`Failed to load ${path.join(__dirname, path_prefix, item.name)}: ${e.message}`);
        }
        for (const { method, handler } of configuration) {
            if (typeof method !== "string") throw new Error(`Failed to load ${path.join(__dirname, path_prefix, item.name)}: Method must be a string, but got ${typeof method}`);
            if (typeof handler !== "function") throw new Error(`Failed to load ${path.join(__dirname, path_prefix, item.name)}: Handler must be a function, but got ${typeof handler}`);
            const method_path = `${method.toUpperCase()} ${api_path}`;
            if (!registered_paths.includes(method_path)) {
                registered_paths.push(method_path);
                router[method.toLowerCase()](api_path, async (req, res) => {
                    try {
                        await handler(req, res);
                    } catch (e) {
                        logger.e(`Failed to handle ${method_path}: ${e.message}`);
                        logger.e(e.stack);
                        stdrtn.server_error(res);
                    }
                });
                logger.d(`${method_path} => ${path.join(__dirname, path_prefix, item.name)}`);
            } else {
                throw new Error(`Failed to load ${path.join(__dirname, path_prefix, item.name)}: ${method_path} is already registered`);
            }
        }
    }
};

const handle_directory = (item, path_prefix) => {
    const sub_path = path_prefix + item.name + "/";
    const sub_items = fs.readdirSync(path.join(__dirname, path_prefix, item.name), { withFileTypes: true });
    for (const sub_item of sub_items) {
        if (sub_item.isDirectory()) {
            handle_directory(sub_item, sub_path);
        } else {
            handle_file(sub_item, sub_path);
        }
    }
};

// Load all router scripts
try {
    const items = fs.readdirSync(path.join(__dirname), { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory()) {
            handle_directory(item, "/");
        } else {
            if (item.name === "autoloader.js") continue;
            handle_file(item, "/");
        }
    }
} catch (e) {
    logger.e(`An error occurred while loading routes: ${e}\n${e.stack}`);
}


module.exports = router;