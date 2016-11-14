Task Manager
=====

Simple Task Manager App

Usage
-----

Install and configure the aws cli. Navigate to the src folder and run the following.

Using Express
```
$ make dependencies
$ make run
```
Or using terraform

```
$ make deploy
```
This will build the app, download dependencies, and deploy the lambdas & services.


To tear down the infrastructure use:

```
$ make destroy
```

Frameworks
--------

Express

```
$ make dependencies
$ make run
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
