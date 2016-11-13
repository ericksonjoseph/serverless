'use strict';

var doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const App = require('./task-manager.js');

/**
 * Cron
 */
exports.handler = (event, context, callback) => {

    App.runDailyCron(dynamo, context.succeed);
};
