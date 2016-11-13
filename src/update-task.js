
'use strict';

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const App = require('./task-manager.js');

/**
 * Update Task
 */
exports.handler = (event, context, callback) => {

    let task = JSON.parse(event.body);
    let taskId = null;

    if (event.pathParameters && event.pathParameters.id !== undefined) {
        taskId = event.pathParameters.id;
    }

    App.updateTask(taskId, task, dynamo, context.succeed);
};
