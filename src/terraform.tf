provider "aws" {
  region     = "us-east-1"
}

resource "aws_dynamodb_table" "basic-dynamodb-table" {
    name = "tasks"
    read_capacity = 20
    write_capacity = 20
    hash_key = "id"
    attribute {
      name = "id"
      type = "S"
    }
}
resource "aws_iam_role" "lambda" {
    name = "lambda"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "daily" {
    filename = "./daily.zip"
    function_name = "daily"
    role = "${aws_iam_role.lambda.arn}"
    handler = "daily.handler"
    source_code_hash = "${base64sha256(file("./daily.zip"))}"
    runtime = "nodejs4.3"
}

resource "aws_lambda_function" "add-task" {
    filename = "./add-task.zip"
    function_name = "add-task"
    role = "${aws_iam_role.lambda.arn}"
    handler = "add-task.handler"
    source_code_hash = "${base64sha256(file("./add-task.zip"))}"
    runtime = "nodejs4.3"
}

resource "aws_lambda_function" "list-task" {
    filename = "./list-task.zip"
    function_name = "list-task"
    role = "${aws_iam_role.lambda.arn}"
    handler = "list-task.handler"
    source_code_hash = "${base64sha256(file("./list-task.zip"))}"
    runtime = "nodejs4.3"
}

resource "aws_lambda_function" "update-task" {
    filename = "./update-task.zip"
    function_name = "update-task"
    role = "${aws_iam_role.lambda.arn}"
    handler = "update-task.handler"
    source_code_hash = "${base64sha256(file("./update-task.zip"))}"
    runtime = "nodejs4.3"
}

resource "aws_lambda_function" "delete-task" {
    filename = "./delete-task.zip"
    function_name = "delete-task"
    role = "${aws_iam_role.lambda.arn}"
    handler = "delete-task.handler"
    source_code_hash = "${base64sha256(file("./delete-task.zip"))}"
    runtime = "nodejs4.3"
}
