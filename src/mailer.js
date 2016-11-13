
'use strict';

const config = require('./config.js');
const nodemailer = require('nodemailer');
const directTransport = require('nodemailer-direct-transport');


/**
 * Sends Emails
 *
 * @var emails object - e.g. { user: "user@example.com", description: "emailitem" }
 * @var callback - called after all emails have been sent
 */
exports.sendEmails = (emails, callback) => {

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

    // Configure mailer
    let transporter = nodemailer.createTransport({
        service: config.transport,
        auth: {
            user: config.email,
        pass: config.password
        }
    });
    //let transporter = nodemailer.createTransport(directTransport({debug: true}));

    // Send Emails
    for (let prop in recipients) {

        var settings = {
            to: prop,
            subject: config.mailer.subject,
            html: '<h2>' + config.mailer.note + '</h2><ul>' + recipients[prop] + '</ul>',
            from: '"' + config.mailer.subject + ' <' + config.email + '>'
        };

        transporter.sendMail(settings, (error, info) => {
            if (error) console.log(error.message, prop, recipients);
        });
    }

    // Quickly respond
    callback(null, { message: "Emails Sent", recipients: Object.keys(recipients) }, '200');
}
