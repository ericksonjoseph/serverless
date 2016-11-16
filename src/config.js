exports.tableName = 'tasks'
exports.primary_key = 'id'
exports.email = 'erickson1.joseph@gmail.com'
exports.transport = 'Gmail'
exports.port = 3000
exports.region = "us-east-1"
exports.dynamodb = {
    //endpoint: 'http://localhost:8000'
}
exports.mailer = {
    test: true,
    subject: "Daily Task Manager",
    note: "You Have uncompleted tasks",
    region: "us-east-1"
}
