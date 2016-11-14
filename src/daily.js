'use strict';

var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();
var App = require('./task-manager.js');

/**
 * Cron
 */
exports.handler = (event, context, callback) => {

    App.runDailyCron(dynamo, context.succeed);
};
