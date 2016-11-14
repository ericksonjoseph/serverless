'use strict';

var doc = require('dynamodb-doc');
const AWS = require('aws-sdk');
const App = require('./task-manager.js');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');

AWS.config.update({
      region: config.region,
});

const dynamo = new doc.DynamoDB();

/**
 * Server
 */
var app = express();
var jsonParser = bodyParser.json({ type: 'application/json'});

var respond = (res, response) => {
    for (let prop in response.headers) {
        res.append(prop, response.headers[prop]);
    }
    res.status(response.statusCode).send(response.body);
}

app.get('/daily', function (req, res) {
    App.runDailyCron(dynamo, (response) => {
        respond(res, response);
    });
})

app.post('/task', jsonParser, function (req, res) {

    App.createTask(req.body, dynamo, (response) => {
        respond(res, response);
    });
})

app.get('/task/:id?', function (req, res) {

    App.getTask(req.params.id, dynamo, (response) => {
        respond(res, response);
    });
})

app.put('/task/:id', jsonParser, function (req, res) {

    App.updateTask(req.params.id, req.body, dynamo, (response) => {
        respond(res, response);
    });
})

app.delete('/task/:id', function (req, res) {

    App.deleteTask(req.params.id, dynamo, (response) => {
        respond(res, response);
    });
})

app.listen(config.port, function () {
    console.log(`Example app listening on port ${config.port}!`)
})
