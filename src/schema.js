exports.default = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": "A task",
    "properties": {
        "user": {
            "type": "string",
            "minLength": 5,
            "maxLength": 254,
            "title": "User",
            "description": "User's email address"
        },
        "description": {
            "type": "string",
            "minLength": 1,
            "title": "Description of the task"
        },
        "priority": {
            "type": "integer",
            "multipleOf": 1,
            "maximum": 9,
            "minimum": 0,
            "title": "Priority",
            "description": "Task priority, as a single-digit integer. 0 is highest priority"
        },
        "completed": {
            "type": "string",
            "format": "date-time",
            "title": "Completed",
            "description": "Completed datetime, formatted as an ISO8601 string"
        } 
    },
    "required": [
        "description",
        "priority"
    ]
};
