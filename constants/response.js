const Response = (data, res, m) => {
    var c =
        data === null
            ? false
            : data === undefined
                ? false
                : data?.length === 0
                    ? false
                    : true;
    if (c) {
        res.send({ doc: data, message: "Success", status: 200 });
    } else {
        res.send({ message: m ? m : "fail", status: 404 });
    }
};

const Fail = (err, message, res, code) => {
    if (!res) {
        console.error("Response object is null.");
        return;
    }
    res.send({ error: err, message: message, status: code ? code : 500 });
};


module.exports = { Response, Fail }