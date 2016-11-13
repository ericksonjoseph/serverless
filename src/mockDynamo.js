
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
            }
        ]
    });
}

exports.putItem = (options, callback) => {

    callback(false, {
        Error: false
    });
}

exports.updateItem = (options, callback) => {
}

exports.deleteItem = (options, callback) => {
}
