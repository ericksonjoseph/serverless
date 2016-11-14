NAME := daily
ROLE := arn:aws:iam::307997508224:role/lambda-kinesis
PROFILE := work
LOG := invoke.log
REGION := us-east-1
CURRENT_DIR = $(shell pwd)
ZIP = node_modules package.json *.js

.DEFAULT: help
.IGNORE: clean

all: help

# TARGET:create             Create
create: build
	aws lambda create-function \
		--region $(REGION) \
		--function-name $(NAME)  \
		--zip-file fileb://$(NAME).zip \
		--role $(ROLE) \
		--handler $(NAME).handler \
		--runtime nodejs4.3 \
		--profile $(PROFILE)

# TARGET:update             Update
update: build
	aws lambda update-function-code \
		--function-name $(NAME)  \
		--zip-file fileb://$(NAME).zip \
		--profile $(PROFILE) \
		--region $(REGION)

# TARGET:build              Zip up the lambda
build: zip

apply: clean dependencies build
	terraform apply

destroy:
	terraform destroy

dependencies:
	rm -r node_modules
	npm install

zip:
	zip -r daily.zip daily.js $(ZIP)
	zip -r add-task.zip add-task.js $(ZIP)
	zip -r list-task.zip list-task.js $(ZIP)
	zip -r update-task.zip update-task.js $(ZIP)
	zip -r delete-task.zip delete-task.js $(ZIP)

# TARGET:test              Call the lambda remotely
test:
	aws lambda invoke \
		--invocation-type RequestResponse \
		--function-name $(NAME) \
		--region $(REGION) \
		--payload file://../events/$(NAME).event \
		--profile $(PROFILE) \
		$(LOG)

# TARGET:clean              Clean
clean:
	rm $(CURRENT_DIR)/*.zip
	rm $(CURRENT_DIR)/$(LOG)

# TARGET:help               Help
help:
	# Usage:
	#   make <target> [OPTION=value]
	#
	# Targets:
	@egrep "^# TARGET:" [Mm]akefile | sed 's/^# TARGET:/#   /'
