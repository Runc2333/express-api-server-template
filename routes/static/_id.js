const model = require("../../models/static/_id");

module.exports = [
    {
        method: "GET",
        handler: async (req, res) => {
            // 绑定请求参数
            const request_params = params.bind(req, model.request);
            if (request_params === false) return;
            stdrtn.success(res, `Requested id is ${req.params.id}, query is ${JSON.stringify(request_params)}`);
        },
    },
];