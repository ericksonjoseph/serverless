NAME := daily
PROFILE := work
LOG := invoke.log
REGION := us-east-1
ROOT = $(shell pwd)/src/
ZIP = node_modules package.json *.js

.DEFAULT: help
.IGNORE: clean dependencies

all: help

# TARGET:build              Zip up the lambdas
build: zip

# TARGET:deploy             Deploy the app
deploy: clean dependencies build
	terraform apply

# TARGET:run                Run app in express
run:
	cd $(ROOT) \
		&& node main.js

# TARGET:destroy            Tear down infrastructure
destroy:
	terraform destroy

# TARGET:dependencies       npm install
dependencies:
	cd $(ROOT) \
		&& rm -r $(ROOT)node_modules; \
		npm install

zip:
	cd $(ROOT) && \
		zip -r daily.zip daily.js $(ZIP); \
		zip -r add-task.zip add-task.js $(ZIP); \
		zip -r list-task.zip list-task.js $(ZIP); \
		zip -r update-task.zip update-task.js $(ZIP); \
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
	cd $(ROOT) \
		&& rm *.zip; \
		rm $(LOG)

delete_functions:
	aws lambda delete-function --function-name daily; \
	aws lambda delete-function --function-name add-task; \
	aws lambda delete-function --function-name list-task; \
	aws lambda delete-function --function-name update-task; \
	aws lambda delete-function --function-name delete-task; \

# TARGET:help               Help
help:
	# Usage:
	#   make <target> [OPTION=value]
	#
	# Targets:
	@egrep "^# TARGET:" [Mm]akefile | sed 's/^# TARGET:/#   /'
