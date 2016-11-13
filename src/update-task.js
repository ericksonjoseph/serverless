'use strict';

const ajv = require('ajv');
const schema = require('./schema.js');
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

    let task = JSON.parse(event.body);

    // Validate params
    let d_schema = schema.default;

    d_schema.required = undefined;
    let validator = new ajv();
    let validate = validator.compile(d_schema);
    let valid = validate(task);
    if (!valid) {
        respond({ error: validate.errors }, '400');
    }

    // Get all properties that SHOULD be updated
    let sets  = [];
    let values = [];
    let names = [];
    for (let prop in task) {
        if (!d_schema.properties.hasOwnProperty(prop)) continue;
        sets.push(`#${prop} = :${prop}`);
        names[`#${prop}`] = prop;
        values[`:${prop}`] = task[prop];
    };

    if (sets.length === 0) {
        respond({ error: "Nothing to update" }, '400');
    }

    let joined = sets.join(',');
    let updateExpression = `SET ${joined}`;

    // Prepare Payload
    let params = {
        Key: {
            id: event.pathParameters.id
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: names,
        TableName: config.tableName
    };

    try {
        dynamo.updateItem(params, (err, res) => {
            if (err) respond({error: err.message}, '500');
            respond(res, '200');
        });
    } catch (err) {
        respond({ error: err.message }, '500');
    }
};

/*
   dynamo.deleteItem(JSON.parse(event.body), done);
   dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
   dynamo.updateItem(JSON.parse(event.body), done);
*/
