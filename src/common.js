
'use strict';

/**
 * Common
 */
exports.respond = (body, statusCode) => {

    let headers = {
        'Content-Type': 'application/json',
    };

    body = JSON.stringify(body);
    return { statusCode, headers, body };
};
