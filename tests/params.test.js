/* eslint-disable */
const params = require("../utils/params");

const network = jest.fn(arg => true);
const logger = jest.fn(arg => true);
global.stdrtn = {
    param_error: network,
};
global.logger = {
    t: logger,
    d: logger,
    i: logger,
    w: logger,
    e: logger,
};

afterEach(() => {
    jest.clearAllMocks();
});

const request_model = {
    type: "request",
    params: {
        string: {
            type: "string",
            required: true,
        },
        number: {
            type: "number",
            required: true,
        },
        boolean: {
            type: "boolean",
            required: true,
        },
        array: {
            type: "array",
            required: true,
        },
        object: {
            type: "object",
            required: true,
        },
        string_default: {
            type: "string",
            default: "default",
            required: false,
        },
        number_default: {
            type: "number",
            default: 1,
            required: false,
        },
        boolean_default: {
            type: "boolean",
            default: true,
            required: false,
        },
        array_default: {
            type: "array",
            default: [1, 2, 3],
            required: false,
        },
        object_default: {
            type: "object",
            default: {
                a: 1,
                b: 2,
            },
            required: false,
        },
    },
};

const response_model = {
    type: "response",
    params: {
        string: {
            type: "string",
            required: true,
        },
        number: {
            type: "number",
            required: true,
        },
        boolean: {
            type: "boolean",
            required: true,
        },
        array: {
            type: "array",
            required: true,
        },
        object: {
            type: "object",
            required: true,
        },
        string_default: {
            type: "string",
            default: "default",
            required: false,
        },
        number_default: {
            type: "number",
            default: 1,
            required: false,
        },
        boolean_default: {
            type: "boolean",
            default: true,
            required: false,
        },
        array_default: {
            type: "array",
            default: [1, 2, 3],
            required: false,
        },
        object_default: {
            type: "object",
            default: {
                a: 1,
                b: 2,
            },
            required: false,
        },
    },
};

test("GET request: Missing parameter", () => {
    const data = params.bind({
        method: "GET",
        res: "fake res",
        query: {
            string: "123",
            boolean: true,
            array: "1,2,3",
        },
    }, request_model);
    expect(data).toBe(false);
    expect(network.mock.calls[0][0]).toBe("fake res");
    expect(logger.mock.calls[0][0].message).toBe("number is required");
});

test("GET request: Array mismatch", () => {
    const data = params.bind({
        method: "GET",
        res: "fake res",
        query: {
            string: "123",
            number: 123,
            boolean: true,
            array: "1,2,3",
        },
    }, request_model);
    expect(data).toBe(false);
    expect(network.mock.calls[0][0]).toBe("fake res");
    expect(logger.mock.calls[0][0].message).toBe("array is not an array, and can not be parsed");
});

test("GET request: Object mismatch", () => {
    const data = params.bind({
        method: "GET",
        res: "fake res",
        query: {
            string: "123",
            number: 123,
            boolean: true,
            array: "[1,2,3]",
            object: "1,2,3",
        },
    }, request_model);
    expect(data).toBe(false);
    expect(network.mock.calls[0][0]).toBe("fake res");
    expect(logger.mock.calls[0][0].message).toBe("object is not an object, and can not be parsed");
});

test("GET request: Overwrite defaults", () => {
    const data = params.bind({
        method: "GET",
        res: "fake res",
        query: {
            string: "123",
            number: 123,
            boolean: true,
            array: "[1,2,3]",
            object: `{"a":1,"b":2}`,
            string_default: "overwrite",
        },
    }, request_model);
    expect(data).toEqual({
        string: "123",
        number: 123,
        boolean: true,
        array: [1, 2, 3],
        object: {
            a: 1,
            b: 2,
        },
        string_default: "overwrite",
        number_default: 1,
        boolean_default: true,
        array_default: [1, 2, 3],
        object_default: {
            a: 1,
            b: 2,
        },
    });
    expect(network.mock.calls.length).toBe(0);
    expect(logger.mock.calls.length).toBe(0);
});

test("POST request: Array is an object", () => {
    const data = params.bind({
        method: "POST",
        res: "fake res",
        body: {
            string: "123",
            number: 123,
            boolean: true,
            array: {
                a: 1,
                b: 2,
            },
        },
    }, request_model);
    expect(data).toBe(false);
    expect(network.mock.calls[0][0]).toBe("fake res");
    expect(logger.mock.calls[0][0].message).toBe("array must be an array");
});

test("POST request: Extra fields", () => {
    const data = params.bind({
        method: "POST",
        res: "fake res",
        body: {
            string: "123",
            number: 123,
            boolean: true,
            array: [1, 2, 3],
            object: {
                a: 1,
                b: 2,
            },
            string_default: "overwrite",
            useless: "useless",
        },
    }, request_model);
    expect(data).toEqual({
        string: "123",
        number: 123,
        boolean: true,
        array: [1, 2, 3],
        object: {
            a: 1,
            b: 2,
        },
        string_default: "overwrite",
        number_default: 1,
        boolean_default: true,
        array_default: [1, 2, 3],
        object_default: {
            a: 1,
            b: 2,
        },
    });
    expect(network.mock.calls.length).toBe(0);
    expect(logger.mock.calls.length).toBe(0);
});