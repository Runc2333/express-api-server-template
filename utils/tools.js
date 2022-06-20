module.exports = {
    date_format: (date, no_time = false) => {
        if (date === undefined) return "";
        if (typeof date === "string" || typeof date === "number") {
            date = new Date(date);
        }
        const temp_date = date.toLocaleString()
            .split(" ")
            .map((v, i) => {
                return v.split(/\/|:/)
                    .map(vv => {
                        return vv.length < 2 ? `0${vv}` : vv;
                    })
                    .join(["-", ":"][i]);
            });
        return no_time ? temp_date[0] : temp_date.join(" ");
    },
};