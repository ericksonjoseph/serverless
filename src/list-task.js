'use strict';

var doc = require('dynamodb-doc');
const config = require('./config.js');
const dynamo = new doc.DynamoDB();

/**
 * List User(s)
 */
exports.handler = (event, context, callback) => {

    let params = {
        TableName : config.tableName
    };

    if (event.pathParameters && event.pathParameters.id !== undefined) {
        params.FilterExpression = '#id = :id';
        params.ExpressionAttributeValues = {':id' : event.pathParameters.id};
        params.ExpressionAttributeNames = {'#id' : 'id'};
    }

    try {
        dynamo.scan(params, (err, res) => {

            let body = err ? err.message : JSON.stringify(res);

            context.succeed({
                statusCode: err ? '500' : '200',
                headers: {
                    'Content-Type': 'application/json',
                },
                body
            });
        });
    } catch (err) {
        respond({ error: err.message }, '500');
    }
};
