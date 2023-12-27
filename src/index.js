const { checkForNewEmails, sendReply, addLabel } = require('./gmailService');
const config = require('./config');
const { authorize } = require('./auth');
const { google } = require('googleapis'); //  'google' object from the 'googleapis' library

async function main() {
    try {
        const auth = await authorize();

        setInterval(async () => {
            const emails = await checkForNewEmails(auth);

            for (const email of emails) {
                const threadId = email.threadId;
                const messageId = email.id;

                // Check if the email thread has no prior replies
                const hasNoReplies = await checkNoReplies(auth, threadId);

                if (hasNoReplies) {
                    // Send a reply
                    await sendReply(auth, threadId);

                    // Add a label to the email
                    await addLabel(auth, messageId, config.labelName);
                }
            }
        }, getRandomInterval());
    } catch (error) {
        console.error('Error:', error);
    }
}

async function checkNoReplies(auth, threadId) {
    try {
        // Implement logic to check if the email thread has no prior replies
        const gmail = google.gmail({ version: 'v1', auth });
        const thread = await gmail.users.threads.get({
            userId: config.gmailId,
            id: threadId,
        });

        return thread.data.messages.length === 1; // Assuming the first message is the original email
    } catch (error) {
        console.error('Error checking replies:', error);
        return false; // Assume there are replies in case of an error
    }
}

function getRandomInterval() {
    return Math.floor(Math.random() * (config.maxInterval - config.minInterval + 1)) + config.minInterval;
}

main();

