
'use strict';

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const App = require('./task-manager.js');

/**
 * Add Task
 */
exports.handler = (event, context, callback) => {

    let task = JSON.parse(event.body);

    App.createTask(task, dynamo, context.succeed);
};
