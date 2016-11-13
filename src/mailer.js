
'use strict';

const aws = require('aws-sdk');
const config = require('./config.js');

/**
 * Sends Emails
 *
 * @var emails object - e.g. { user: "user@example.com", description: "emailitem" }
 * @var callback - called after all emails have been sent
 */
exports.sendEmails = (emails, callback) => {

    aws.config.update({region: 'us-east-1'});
    let ses = new aws.SES();

    // Get Recipients
    let recipients = {};
    emails.Items.forEach((obj, idx) => {
        if (!("user" in obj) || !("description" in obj)) return;
        recipients[obj.user] += `<li>${obj.description}</li>`;
    });

    if (config.test) {
        callback(null, { message: "Emails Sent (dev mode)", recipients: Object.keys(recipients) }, '200');
        return;
    }

    for (let prop in recipients) {
        var params = {
            Destination: { 
                 ToAddresses: [
                     prop,
                 ]
            },
            Message: {
                 Body: {
                     Html: {
                           Data: recipients[prop],
                       },
                 },
                 Subject: {
                     Data: config.mailer.subject,
                 }
            },
            Source: config.email, /* required */
        };

        ses.sendEmail(params, function(error, data) {
            if (error) console.log(error.message, prop, recipients);
        });
    }

    // Quickly respond
    callback(null, { message: "Emails Sent", recipients: Object.keys(recipients) }, '200');
}
