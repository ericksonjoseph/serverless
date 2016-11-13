'use strict';

var doc = require('dynamodb-doc');
const config = require('./config.js');
const dynamo = new doc.DynamoDB();
const mailer = require('./mailer.js');
const common = require('./common.js');

/**
 * Cron
 */
exports.handler = (event, context, callback) => {

    // Define callback
    let respond = (body, statusCode) => {
        context.succeed(common.respond(body, statusCode));
    };

    let params = {
        TableName : config.tableName,
        FilterExpression: 'NOT attribute_exists (completed) AND attribute_exists (#user)',
        ExpressionAttributeNames: {'#user' : 'user'}
    };

    try {
        dynamo.scan(params, (err, res) => {

            if (err) respond({ error: err.message }, '500');

            if (res.Items.length === 0) {
                respond({ message: 'No emails to send' }, '200');
            }

            mailer.sendEmails(res, (err, body) => {
                if (err) respond({ error: err.message }, '500');
                respond(body, '200');
            });
        });
    } catch (err) {
        respond({ error: err.message }, '500');
    }
};
