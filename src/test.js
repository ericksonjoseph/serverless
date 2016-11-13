

const dynamo = require('./mockDynamo.js');
const App = require('./task-manager.js');

var context = function(){};
context.succeed = (res) => console.log("Response: ", res);

TestCreateTask();
TestListTask();
TestUpdateTask();
TestDeleteTask();
Daily();

function TestCreateTask() {
    let task = {
        user: "erickson1.joseph@gmail.com",
        description: "Do something else awesome",
        priority: 1
    }
    App.createTask(task, dynamo, context.succeed);
}

function TestListTask() {
    let taskId = "target";
    App.getTask(taskId, dynamo, context.succeed);
}

function TestUpdateTask() {
    let taskId = "target";
    let task = {
        priority: 9
    }
    App.updateTask(taskId, task, dynamo, context.succeed);
}

function TestDeleteTask() {
    let taskId = "target";
    App.deleteTask(taskId, dynamo, context.succeed);
}

function Daily() {
    App.runDailyCron(dynamo, context.succeed);
}
