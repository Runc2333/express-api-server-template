const dateformat = require("dateformat");

/* 绑定请求参数到输入模型 */
const bind = (req, modal) => {
    if (req.method === 'POST' || req.method === 'DELETE') {
        let params = req.body;
        var bindObj = {};
        for (key in modal) {
            if (typeof params[key] === modal[key].type) { // 严格判断传入的数据类型
                if (params[key] === '' && modal[key].required) { // 判断传入数据是否有效
                    stdrtn.paramError(req.res);
                    return false;
                } else if (params[key] === '' && !modal[key].required) {
                    // 绑定默认值
                    if (typeof modal[key].default !== undefined) {
                        bindObj[key] = modal[key].default;
                    }
                } else {
                    bindObj[key] = params[key];
                    // 有效值
                    if (typeof modal[key].valid !== 'undefined' && modal[key].valid.indexOf(params[key]) === -1) {
                        stdrtn.paramError(req.res);
                        return false;
                    }
                    // 上界
                    if (typeof modal[key].upperlimit !== 'undefined' && params[key] > modal[key].upperlimit) {
                        bindObj[key] = modal[key].upperlimit;
                    }
                }
            } else {
                if (modal[key].required) {
                    stdrtn.paramError(req.res);
                    return false;
                } else {
                    // 绑定默认值
                    if (typeof modal[key].default !== undefined) {
                        bindObj[key] = modal[key].default;
                    }
                }
            }
        }
    } else if (req.method === 'GET') {
        let params = req.query;
        var bindObj = {};
        for (key in modal) {
            if (typeof params[key] !== 'undefined') { // 不判断传入数据类型
                // 强制转换为所需数据类型
                switch (modal[key].type) {
                    case 'string':
                        if (String(params[key]) === '' && modal[key].required) { // 判断传入数据是否有效
                            stdrtn.paramError(req.res);
                            return false;
                        } else if (String(params[key]) === '' && !modal[key].required) {
                            // 绑定默认值
                            if (typeof modal[key].default !== undefined) {
                                bindObj[key] = modal[key].default;
                            }
                        } else {
                            bindObj[key] = String(params[key]);
                            // 有效值
                            if (typeof modal[key].valid !== 'undefined' && modal[key].valid.indexOf(String(params[key])) === -1) {
                                stdrtn.paramError(req.res);
                                return false;
                            }
                        }
                        break;
                    case 'number':
                        bindObj[key] = parseFloat(params[key]);
                        // 有效值
                        if (typeof modal[key].valid !== 'undefined' && modal[key].valid.indexOf(parseFloat(params[key])) === -1) {
                            stdrtn.paramError(req.res);
                            return false;
                        }
                        // 上界
                        if (typeof modal[key].upperlimit !== 'undefined' && parseFloat(params[key]) > modal[key].upperlimit) {
                            bindObj[key] = modal[key].upperlimit;
                        }
                        break;
                    case 'boolean':
                        bindObj[key] = params[key] ? true : false;
                        break;
                    default:
                        // GET请求不能传递，也无法转换为Array、Object、Function
                        stdrtn.serverError(req.res);
                        break;
                }
            } else {
                if (modal[key].required) {
                    stdrtn.paramError(req.res);
                    return false;
                } else {
                    // 绑定默认值
                    if (typeof modal[key].default !== undefined) {
                        bindObj[key] = modal[key].default;
                    }
                }
            }
        }
    }
    return bindObj;
}

const bindRtn = (data, modal) => {
    let bindObj = {};
    for (key in modal) {
        if (typeof data[modal[key].keyname] !== 'undefined') { // 不判断传入数据类型
            // 强制转换为所需数据类型
            switch (modal[key].type) {
                case 'string':
                    if (data[modal[key].keyname] instanceof Date) {
                        bindObj[key] = dateformat(data[modal[key].keyname], 'yyyy-mm-dd HH:MM:ss');
                    } else {
                        bindObj[key] = String(data[modal[key].keyname]);
                    }
                    break;
                case 'number':
                    bindObj[key] = isNaN(parseFloat(data[modal[key].keyname])) ? 0 : parseFloat(data[modal[key].keyname]);
                    break;
                case 'boolean':
                    bindObj[key] = data[modal[key].keyname] ? true : false;
                    break;
                default:
                    bindObj[key] = data[modal[key].keyname];
                    break;
            }
        }
    }
    return bindObj;
}

module.exports = {
    bind,
    bindRtn,
}