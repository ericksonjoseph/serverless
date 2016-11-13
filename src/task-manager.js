
'use strict';

const guid = require('guid');
const moment = require('moment');

const config = require('./config.js');
const mailer = require('./mailer.js');
const common = require('./common.js');
const schemas = require('./schema.js');

var app = function(){};

module.exports = app;

(function(a){

    const PRIMARY_KEY = config.primary_key;
    const HTTP_OK = '200';
    const HTTP_ERROR = '500';
    const HTTP_BAD = '400';

    a.getTask = (taskId, dynamo, callback) => {

        let params = {};

        if (taskId !== null) {
            let params = common.buildPrimaryKeyFilter(PRIMARY_KEY, taskId);
        }

        params.TableName = config.tableName;

        try {
            dynamo.scan(params, (err, res) => {
                if (err) {  
                    a._respond(callback, {error: err.message}, HTTP_ERROR);
                    return;
                }
                a._respond(callback, JSON.stringify(res), HTTP_OK);
            });
        } catch (err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        }
    }

    a.deleteTask = (taskId, dynamo, callback) => {

        if (taskId === null) {
            a._respond(callback, { error: "Missing Task ID" }, HTTP_BAD);
            return;
        }

        // Prepare Payload
        let params = {
            Key: { id: taskId },
            TableName: config.tableName
        };

        try {
            dynamo.deleteItem(params, (err, res) => {
                if (err) {  
                    a._respond(callback, {error: err.message}, HTTP_ERROR);
                    return;
                }
                a._respond(callback, res, HTTP_OK);
            });
        } catch (err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        }
    }

    a.createTask = (task, dynamo, callback) => {

        // Validate params
        if (!common.validateParams(task, schemas.default)) {
            a._respond(callback, { error: validate.errors }, HTTP_BAD);
            return;
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
                if (err) {  
                    a._respond(callback, {error: err.message}, HTTP_ERROR);
                    return;
                }
                a._respond(callback, res, HTTP_OK);
            });
        } catch (err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        }
    }

    a.updateTask = (taskId, task, dynamo, callback) => {

        // Parse input Data
        if (taskId == null) {
            a._respond(callback, { error: "Missing Task ID" }, HTTP_BAD);
            return;
        }

        // Modify Schema
        let schema = schemas.default;
        schema.required = undefined;

        // Validate params
        if (!common.validateParams(task, schema)){
            a._respond(callback, { error: validate.errors }, HTTP_BAD);
            return;
        }

        // Get all properties that SHOULD be updated
        let params = common.buildUpdateParams(task, schema);
        if (params === false) {
            a._respond(callback, { error: "Nothing to update" }, HTTP_BAD);
            return;
        }

        params.Key = {}
        params.Key[PRIMARY_KEY] = taskId;
        params.TableName = config.tableName;

        try {
            dynamo.updateItem(params, (err, res) => {
                if (err) {  
                    a._respond(callback, {error: err.message}, HTTP_ERROR);
                    return;
                }
                a._respond(callback, res, HTTP_OK);
            });
        } catch (err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        }
    }

    a.runDailyCron = function(dynamo, callback) {

        let params = {
            TableName : config.tableName,
            FilterExpression: 'NOT attribute_exists (completed) AND attribute_exists (#user)',
            ExpressionAttributeNames: {'#user' : 'user'}
        };

        try {
            dynamo.scan(params, (err, res) => {

                if (err) {  
                    a._respond(callback, {error: err.message}, HTTP_ERROR);
                    return;
                }

                if (res.Items.length === 0) {
                    a._respond(callback, { message: 'No emails to send' }, HTTP_OK);
                    return;
                }

                mailer.sendEmails(config.mailer, res.Items, (err, body) => {
                    if (err) {
                        a._respond(callback, { error: err.message }, HTTP_ERROR);
                        return;
                    }
                    a._respond(callback, body, HTTP_OK);
                });
            });
        } catch (err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        }
    }

    a._respond = (callback, body, statusCode) => {
        callback(common.respond(body, statusCode));
    };

})(app);
