module.exports = [
    {
        method: "GET",
        handler: async (req, res) => {
            stdrtn.success(res, `Requested id is ${req.params.id}`);
        },
    },
];