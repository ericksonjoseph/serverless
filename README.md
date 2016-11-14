Task Manager
=====

Simple Task Manager App

Usage
-----

Install the aws command line tool for your system. Navigate to the src folder and run:

```
$ make deploy
```
this will build the app and deploy the services using terraform


To tear down the infrastructure use:

```
$ make destroy
```

Frameworks
--------

Express

```
$ node main.js
```

This will launch a local server to test the api

+ Create Task:  POST    /task;
+ Read Task:    GET     /task/:id?; e.g. [click me](https://ynahh7ermj.execute-api.us-east-1.amazonaws.com/stage/task)
+ Update Task:  PUT     /task/:id;
+ Delete Task:  DELETE  /task/:id;
+ Run Daily:    GET     /daily;

API Gateway
--------

See swagger.json

Config
--------

Additional options in src/config.js
