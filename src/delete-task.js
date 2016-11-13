
'use strict';

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const App = require('./task-manager.js');

/**
 * Delete Task
 */
exports.handler = (event, context, callback) => {

    let task = JSON.parse(event.body);
    let taskId = null;

    if (event.pathParameters && event.pathParameters.id !== undefined) {
        taskId = event.pathParameters.id;
    }

    App.deleteTask(taskId, dynamo, context.succeed);
};
