
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
    const TABLE_NAME = config.tableName;
    const HTTP_OK = '200';
    const HTTP_CREATED = '201';
    const HTTP_ERROR = '500';
    const HTTP_BAD = '400';
    const HTTP_ACCEPTED = '202';

    a.getTask = (taskId, dynamo, callback) => {

        let params = {};

        if (taskId !== null) {
            params = common.buildPrimaryKeyFilter(PRIMARY_KEY, taskId);
        }

        params.TableName = TABLE_NAME;

        new Promise(function(resolve, reject) {

            dynamo.scan(params, (err, res) => {
                if (err) {  
                    return reject(err);
                }
                resolve({
                    message: "Tasks",
                    items: res.Items,
                    total: res.Count
                });
            });

        }).then(function(body) {
            a._respond(callback, body, HTTP_OK);
        }).catch(function(err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        })
    }

    a.deleteTask = (taskId, dynamo, callback) => {

        if (taskId === null) {
            a._respond(callback, { error: "Missing Task ID" }, HTTP_BAD);
            return;
        }

        // Prepare Payload
        let params = {
            Key: { id: taskId },
            TableName: TABLE_NAME
        };

        new Promise(function(resolve, reject) {

            dynamo.deleteItem(params, (err, res) => {
                if (err) {  
                    return reject(err);
                }
                resolve({ message: "Delete Request Successful" });
            });
        }).then(function(body) {
            a._respond(callback, body, HTTP_OK);
        }).catch(function(err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        })
    }

    a.createTask = (task, dynamo, callback) => {

        // Validate params
        let errors = common.validateParams(task, schemas.default);
        if (errors) {
            a._respond(callback, { error: errors }, HTTP_BAD);
            return;
        }

        // Set defaults
        task.created = moment().format();
        task.id = guid.raw();

        // Prepare Payload
        let params = {
            Item: task,
            TableName: TABLE_NAME,
            ReturnValues: "ALL_OLD"
        };

        new Promise(function(resolve, reject) {

            dynamo.putItem(params, (err, res) => {
                if (err) {  
                    return reject(err);
                }
                resolve({ 
                    message: "Task Created", 
                    task: task 
                });
            });
        }).then(function(body) {
            a._respond(callback, body, HTTP_OK);
        }).catch(function(err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        })
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
        let errors = common.validateParams(task, schema);
        if (errors){
            a._respond(callback, { error: errors }, HTTP_BAD);
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
        params.TableName = TABLE_NAME;
        params.ReturnValues = "UPDATED_NEW";

        new Promise(function(resolve, reject) {

            dynamo.updateItem(params, (err, res) => {
                if (err) {  
                    return reject({error: err.message});
                }
                resolve({
                    messsage: "Task Updated",
                    updates: res.Attributes
                });
            });
        }).then(function(body) {
            a._respond(callback, body, HTTP_OK);
        }).catch(function(err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        })
    }

    a.runDailyCron = function(dynamo, callback) {

        let params = {
            TableName : TABLE_NAME,
            FilterExpression: 'NOT attribute_exists (completed) AND attribute_exists (#user)',
            ExpressionAttributeNames: {'#user' : 'user'}
        };

        new Promise(function(resolve, reject) {

            dynamo.scan(params, (err, res) => {

                if (err) {  
                    return reject(err);
                }

                if (res.Items.length === 0) {
                    return resolve({ message: 'No emails to send' });
                }

                mailer.sendEmails(config.mailer, res.Items, (err, body) => {
                    if (err) {
                        return reject({ error: err.message });
                    }
                    resolve(body);
                });
            });
        }).then(function(body) {
            a._respond(callback, body, HTTP_OK);
        }).catch(function(err) {
            a._respond(callback, { error: err.message }, HTTP_ERROR);
        })
    }

    a._respond = (callback, body, statusCode) => {
        callback(common.respond(body, statusCode));
    };

})(app);
