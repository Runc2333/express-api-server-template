const success = (res, data = null) => {
    if (data === null) {
        res.status(200).send(JSON.stringify({
            ret: 0,
            message: 'ok',
        }));
    } else {
        res.status(200).send(JSON.stringify({
            ret: 0,
            message: 'ok',
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

const notFound = (res) => {
    res.status(200).send(JSON.stringify({
        ret: -10000,
        message: '未知API'
    }));
};

const paramError = (res) => {
    res.status(200).send(JSON.stringify({
        ret: -10001,
        message: '请求参数缺失或有误'
    }));
};

const serverError = (res) => {
    res.status(200).send(JSON.stringify({
        ret: -10002,
        message: '服务器内部错误'
    }));
};

const unknownError = (res) => {
    res.status(200).send(JSON.stringify({
        ret: -10003,
        message: '未知错误'
    }));
};

module.exports = {
    success,
    fail,
    notFound,
    paramError,
    serverError,
    unknownError,
};