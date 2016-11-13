
exports.scan = (options, callback) => {

    callback(false, {
        Items: [
            {
                user: "erickson1.joseph@gmail.com",
                description: "task A!"
            },
            {
                user: "erickson1.joseph@gmail.com",
                description: "task B!"
            },
            {
                user: "snakeyez08@yahoo.com",
                description: "task C!"
            }
        ]
    });
}

exports.putItem = (options, callback) => {

    callback(false, {
        Error: false
    });
}
