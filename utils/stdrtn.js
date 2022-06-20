const success = (res, data = null) => {
    if (data === null) {
        res.status(200).send(JSON.stringify({
            ret: 0,
            message: "ok",
        }));
    } else {
        res.status(200).send(JSON.stringify({
            ret: 0,
            message: "ok",
            data: data,
        }));
    }
};

const fail = (res, msg) => {
    res.status(200).send(JSON.stringify({
        ret: -1,
        message: msg,
    }));
};

const not_found = (res) => {
    res.status(200).send(JSON.stringify({
        ret: -10000,
        message: "resource not found",
    }));
};

const param_error = (res) => {
    res.status(200).send(JSON.stringify({
        ret: -10001,
        message: "bad request",
    }));
};

const server_error = (res) => {
    res.status(200).send(JSON.stringify({
        ret: -10002,
        message: "internal server error",
    }));
};

const unknown_error = (res) => {
    res.status(200).send(JSON.stringify({
        ret: -10003,
        message: "unknown error",
    }));
};

module.exports = {
    success: success,
    fail: fail,
    not_found: not_found,
    param_error: param_error,
    server_error: server_error,
    unknown_error: unknown_error,
};