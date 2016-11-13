
'use strict';

const aws = require('aws-sdk');

/**
 * Sends Emails
 *
 * @var emails object - e.g. { user: "user@example.com", description: "emailitem" }
 * @var callback - called after all emails have been sent
 */
exports.sendEmails = (config, emails, callback) => {

    aws.config.update({region: config.region});
    let ses = new aws.SES();

    // Get Recipients
    let recipients = {};
    emails.forEach((obj, idx) => {
        if (!("user" in obj) || !("description" in obj)) return;
        if (!recipients[obj.user]) recipients[obj.user] = '';
        recipients[obj.user] += `${obj.description}.<br>`;
    });

    if (config.test) {
        callback(null, { message: "(Testing) Emails Sent", recipients: Object.keys(recipients) });
        return;
    }

    for (let prop in recipients) {

        let params = {
            "Destination": { 
                "ToAddresses": [
                    prop,
                ]
            },
            "Message": {
                "Body": {
                    "Html": {
                        "Data": "<h2>" + config.note + "</h2><ul>" + recipients[prop] + "</ul>",
                    },
                },
                "Subject": {
                    "Data": config.subject,
                }
            },
            "Source": config.email,
        };

        ses.sendEmail(params, function(error, data) {
            if (error) console.log(error.message, prop, recipients);
        });
    }

    // Quickly respond
    callback(null, { message: "Emails Sent", recipients: Object.keys(recipients) });
}
