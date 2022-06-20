const bind = (source, model, strict = false) => {
    const result = {};
    for (const key in model.params) {
        const limits = model.params[key];
        limits.required = limits.required || false;
        const source_key = limits.keyname || key;
        if (source[source_key] === undefined && limits.required) {
            throw new Error(`${source_key} is required`);
        }
        if (source[source_key] === undefined && !limits.required) {
            if (limits.default !== undefined) {
                result[key] = limits.default;
            }
            continue;
        }
        switch (limits.type) {
            case "string":
                if (typeof source[source_key] !== "string") {
                    if (strict) throw new Error(`${source_key} must be a string`);
                    result[key] = String(source[source_key]);
                } else {
                    result[key] = source[source_key];
                }
                break;
            case "number":
                if (typeof source[source_key] !== "number") {
                    if (strict) throw new Error(`${source_key} must be a number`);
                    result[key] = Number(source[source_key]);
                    break;
                }
                if (limits.upper_limit !== undefined && source[source_key] > limits.upper_limit) {
                    if (strict) throw new Error(`${source_key} must be less than ${limits.upper_limit}`);
                    result[key] = limits.upper_limit;
                    break;
                }
                if (limits.lower_limit !== undefined && source[source_key] < limits.lower_limit) {
                    if (strict) throw new Error(`${source_key} must be greater than ${limits.lower_limit}`);
                    result[key] = limits.lower_limit;
                    break;
                }
                result[key] = source[source_key];
                break;
            case "boolean":
                if (typeof source[source_key] !== "boolean") {
                    if (strict) throw new Error(`${source_key} must be a boolean`);
                    result[key] = Boolean(source[source_key]);
                } else {
                    result[key] = source[source_key];
                }
                break;
            case "array":
                if (!Array.isArray(source[source_key])) {
                    if (strict) throw new Error(`${source_key} must be an array`);
                    let temp;
                    try {
                        temp = JSON.parse(source[source_key]);
                    } catch (e) {
                        throw new Error(`${source_key} is not an array, and can not be parsed`);
                    }
                    if (!Array.isArray(temp)) {
                        throw new Error(`${source_key} is not an array`);
                    }
                    result[key] = temp;
                } else {
                    result[key] = source[source_key];
                }
                break;
            case "object":
                if (typeof source[source_key] !== "object") {
                    if (strict) throw new Error(`${source_key} must be an object`);
                    let temp;
                    try {
                        temp = JSON.parse(source[source_key]);
                    } catch (e) {
                        throw new Error(`${source_key} is not an object, and can not be parsed`);
                    }
                    if (typeof temp !== "object") {
                        throw new Error(`${source_key} is not an object`);
                    }
                    result[key] = temp;
                } else {
                    result[key] = source[source_key];
                }
                break;
            default:
                result[key] = source[source_key];
                break;
        }
        if (["string", "number"].includes(limits.type)) {
            if (limits.enum !== undefined && !limits.enum.includes(result[key])) {
                throw new Error(`${source_key} must be one of ${limits.enum}`);
            }
            if (limits.length !== undefined) {
                if (limits.length.min !== undefined && result[key].length < limits.length.min) {
                    throw new Error(`${source_key} must be at least ${limits.length.min} characters`);
                }
                if (limits.length.max !== undefined && result[key].length > limits.length.max) {
                    throw new Error(`${source_key} must be at most ${limits.length.max} characters`);
                }
            }
        } else if (limits.type === "boolean") {
            if (limits.enum !== undefined && !limits.enum.includes(result[key])) {
                throw new Error(`${source_key} must be one of ${limits.enum}`);
            }
            if (limits.length !== undefined) {
                throw new Error("Boolean type can not have length");
            }
        } else if (limits.type === "array") {
            if (limits.enum !== undefined) {
                for (const item of result[key]) {
                    if (!limits.enum.includes(item)) {
                        throw new Error(`${source_key} must be one of ${limits.enum}`);
                    }
                }
            }
            if (limits.length !== undefined) {
                if (limits.length.min !== undefined && result[key].length < limits.length.min) {
                    throw new Error(`${source_key} must have at least ${limits.length.min} items`);
                }
                if (limits.length.max !== undefined && result[key].length > limits.length.max) {
                    throw new Error(`${source_key} must have at most ${limits.length.max} items`);
                }
            }
        } else if (limits.type === "object") {
            if (limits.enum !== undefined) {
                throw new Error("Object type is not supported for enum");
            }
            if (limits.length !== undefined) {
                throw new Error("Object type is not supported for length");
            }
        }
    }
    return result;
};

module.exports = {
    bind: (data, model) => {
        if (model.type === "request") {
            try {
                return bind(data.method === "GET" ? data.query : data.body, model, data.method !== "GET");
            } catch (e) {
                logger.d(e.stack);
                stdrtn.param_error(data.res);
                return false;
            }
        } else if (model.type === "response") {
            try {
                return bind(data, model);
            } catch (e) {
                logger.e(e.stack);
                return false;
            }
        } else {
            const e = new Error("Invalid model type");
            logger.e(e.stack);
            throw e;
        }
    },
};