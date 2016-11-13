

var fs = require('fs');

var context = function(){};
context.succeed = (res) => console.log("Response: ", res);
var callback = (res) => console.log("Callback: ", res);

Daily();

function Daily() {

    const lambda = require('./daily.js');


    lambda.handler({}, context, callback);
}

function TestDeleteTask() {

    const lambda = require('./delete-task.js');

    fs.readFile('./delete-task.event', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        event = JSON.parse(data);

        lambda.handler(event, context, callback);
    });
}

function TestUpdateTask() {

    const lambda = require('./update-task.js');

    fs.readFile('./update-task.event', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        event = JSON.parse(data);

        lambda.handler(event, context, callback);
    });
}

function TestAddTask() {

    const lambda = require('./add-task.js');

    var event = {
        "Method": "MOCK",
        "body": JSON.stringify({
            "user": "testy.mctester@example.com",
            //"description": "Do something awesome",
            "priority": 0,
            "completed": "2016-07-06T12:22:46-04:00"
        })
    }

    lambda.handler(event, context, callback);
}

function TestListTask() {

    const lambda = require('./list-task.js');

    fs.readFile('./list-task.event', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        event = JSON.parse(data);

        lambda.handler(event, context, callback);
    });
}
