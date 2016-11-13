'use strict';

const config = require('./config.js');
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

/**
 * Add Task
 */
exports.handler = (event, context, callback) => {

    // Define callback
    let respond = (body, statusCode) => {

        let headers = {
            'Content-Type': 'application/json',
        };

        body = JSON.stringify(body);
        context.succeed({ statusCode, headers, body });
    };

    if (event.pathParameters && event.pathParameters.id !== undefined) {
        respond({ error: "Missing Task ID" }, '400');
    }

    // Prepare Payload
    let params = {
        Key: {
            id: event.pathParameters.id
        },
        TableName: config.tableName
    };

    try {
        dynamo.deleteItem(params, (err, res) => {
            if (err) respond({error: err.message}, '500');
            respond(res, '200');
        });
    } catch (err) {
        respond({ error: err.message }, '500');
    }
};
