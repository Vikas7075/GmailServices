
const { google } = require('googleapis');
const fs = require('fs').promises;
const config = require('./config');
const authorize = require('./auth');


async function checkForNewEmails(auth) {
    try {
        const gmail = google.gmail({ version: 'v1', auth });

        // Fetch the list of messages in the inbox
        const response = await gmail.users.messages.list({
            userId: config.gmailId,
            labelIds: ['INBOX'], // You may need to adjust the label based on your setup
        });

        const emails = response.data.messages || [];
        return emails;
    } catch (error) {
        console.error('Error checking for new emails:', error);
        return [];
    }
}


async function sendReply(auth, threadId) {
    try {
        const gmail = google.gmail({ version: 'v1', auth });

        // Fetch the original message
        const message = await gmail.users.messages.get({
            userId: config.gmailId,
            id: threadId,
        });

        // Extract sender email address
        const sender = message.data.payload.headers.find(header => header.name === 'From').value;

        // Compose the reply
        const replyMessage = `
      Thank you for your email. I am currently out of the office and will respond to your message as soon as possible.
      
      Best regards,
      Vikas Prajapati
    `;

        // Send the reply
        await gmail.users.messages.send({
            userId: config.gmailId,
            requestBody: {
                threadId: threadId,
                raw: Buffer.from(`To: ${sender}\r\nSubject: Re: ${message.data.payload.headers.find(header => header.name === 'Subject').value}\r\n\r\n${replyMessage}`).toString('base64'),
            },
        });

        console.log(`Replied to thread ${threadId}`);
    } catch (error) {
        console.error('Error sending reply:', error);
    }
}

async function addLabel(auth, messageId, labelName) {
    try {
        const gmail = google.gmail({ version: 'v1', auth });

        // Fetch the labels for the user's Gmail account
        const labels = await gmail.users.labels.list({
            userId: config.gmailId,
        });

        // Check if the label exists; if not, create it
        const labelExists = labels.data.labels.some(label => label.name === labelName);

        if (!labelExists) {
            await gmail.users.labels.create({
                userId: config.gmailId,
                requestBody: {
                    name: labelName,
                },
            });

            console.log(`Created label '${labelName}'`);
        }

        // Apply the label to the email
        await gmail.users.messages.modify({
            userId: config.gmailId,
            id: messageId,
            requestBody: {
                addLabelIds: [labelName],
            },
        });

        console.log(`Added label '${labelName}' to email ${messageId}`);
    } catch (error) {
        console.error('Error adding label:', error);
    }
}

module.exports = {
    sendReply,
    addLabel,
    checkForNewEmails
};
