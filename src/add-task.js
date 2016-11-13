'use strict';

const ajv = require('ajv');
const schema = require('./schema.js');
const config = require('./config.js');
const guid = require('guid');
const moment = require('moment');
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

    let task = JSON.parse(event.body);

    // Validate params
    let validator = new ajv();
    let validate = validator.compile(schema.default);
    let valid = validate(task);
    if (!valid) {
        respond({ error: validate.errors }, '400');
    }

    // Set defaults
    task.created = moment().format();
    task.id = guid.raw();

    // Prepare Payload
    let params = {
        Item: task,
        TableName: config.tableName
    };

    try {
        dynamo.putItem(params, (err, res) => {
            if (err) respond({error: err.message}, '500');
            respond(res, '200');
        });
    } catch (err) {
        respond({ error: err.message }, '500');
    }
};
