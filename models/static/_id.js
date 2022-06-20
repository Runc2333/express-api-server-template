module.exports = {
    request: {
        type: "request",
        params: {
            type: {
                type: "string",
                required: true,
                enum: ["cover", "avatar"],
            },
            quality: {
                type: "string",
                required: false,
                default: "medium",
                enum: ["small", "medium", "large"],
            },
        },
    },
    response: {
        type: "response",
        params: {},
    },
};