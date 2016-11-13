
'use strict';

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const App = require('./task-manager.js');

/**
 * List Task(s)
 */
exports.handler = (event, context, callback) => {

    let task = JSON.parse(event.body);
    let taskId = null;

    if (event.pathParameters && event.pathParameters.id !== undefined) {
        taskId = event.pathParameters.id;
    }

    App.getTask(taskId, dynamo, context.succeed);
};
