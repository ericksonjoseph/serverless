
'use strict';

const ajv = require('ajv');

/**
 * Common
 */
exports.respond = (body, statusCode) => {

    let headers = {
        'Content-Type': 'application/json',
    };

    body = JSON.stringify(body);
    return { statusCode, headers, body };
};

exports.validateParams = (task, schema) => { 

    let validator = new ajv();
    let validate = validator.compile(schema);
    if (!validate(task)) {
        return false;
    }

    return true;
}

exports.buildPrimaryKeyFilter = (primaryKey, taskId) => {

    let params = {};

    params.FilterExpression = `#${primaryKey} = :${primaryKey}`;
    params.ExpressionAttributeValues = {};
    params.ExpressionAttributeValues[`:${primaryKey}`] = taskId;
    params.ExpressionAttributeNames = {};
    params.ExpressionAttributeNames[`#${primaryKey}`] = primaryKey;

    return params;
}

exports.buildUpdateParams = (task, schema) => {

    let sets  = [];
    let values = [];
    let names = [];
    for (let prop in task) {
        if (!schema.properties.hasOwnProperty(prop)) continue;
        sets.push(`#${prop} = :${prop}`);
        names[`#${prop}`] = prop;
        values[`:${prop}`] = task[prop];
    };

    if (sets.length === 0) {
        return false;
    }

    let joined = sets.join(',');
    let updateExpression = `SET ${joined}`;

    // Prepare Payload
    return {
        UpdateExpression: updateExpression,
            ExpressionAttributeValues: values,
            ExpressionAttributeNames: names,
    };
}

