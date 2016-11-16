variable "root" {
    type = "string"
    default = "src/"
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "tasks"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

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
  filename         = "${var.root}daily.zip"
  function_name    = "daily"
  role             = "${aws_iam_role.lambda.arn}"
  handler          = "daily.handler"
  source_code_hash = "${base64sha256(file("${var.root}daily.zip"))}"
  runtime          = "nodejs4.3"
}

resource "aws_lambda_function" "add-task" {
  filename         = "${var.root}add-task.zip"
  function_name    = "add-task"
  role             = "${aws_iam_role.lambda.arn}"
  handler          = "add-task.handler"
  source_code_hash = "${base64sha256(file("${var.root}add-task.zip"))}"
  runtime          = "nodejs4.3"
}

resource "aws_lambda_function" "list-task" {
  filename         = "${var.root}list-task.zip"
  function_name    = "list-task"
  role             = "${aws_iam_role.lambda.arn}"
  handler          = "list-task.handler"
  source_code_hash = "${base64sha256(file("${var.root}list-task.zip"))}"
  runtime          = "nodejs4.3"
}

resource "aws_lambda_function" "update-task" {
  filename         = "${var.root}update-task.zip"
  function_name    = "update-task"
  role             = "${aws_iam_role.lambda.arn}"
  handler          = "update-task.handler"
  source_code_hash = "${base64sha256(file("${var.root}update-task.zip"))}"
  runtime          = "nodejs4.3"
}

resource "aws_lambda_function" "delete-task" {
  filename         = "${var.root}delete-task.zip"
  function_name    = "delete-task"
  role             = "${aws_iam_role.lambda.arn}"
  handler          = "delete-task.handler"
  source_code_hash = "${base64sha256(file("${var.root}delete-task.zip"))}"
  runtime          = "nodejs4.3"
}
