const fs = require('fs').promises;
const readline = require('readline');
const { google } = require('googleapis');
const { promisify } = require('util');

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];

// Function to check if the token is expired
function isTokenExpired(token) {
    return token && token.expiry_date < Date.now();
}

async function authorize() {
    try {
        const credentials = await fs.readFile('credentials.json');
        const { client_secret, client_id, redirect_uris } = JSON.parse(credentials).web;

        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        try {
            const token = await fs.readFile('token.json');
            const parsedToken = JSON.parse(token);

            if (isTokenExpired(parsedToken)) {
                console.log('Stored token is expired. Getting a new one...');
                await getAccessToken(oAuth2Client);
            } else {
                oAuth2Client.setCredentials(parsedToken);
            }
        } catch (error) {
            await getAccessToken(oAuth2Client);
        }

        return oAuth2Client;
    } catch (error) {
        console.error('Error reading credentials file:', error.message);
    }
}

async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this URL:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const questionAsync = promisify(rl.question).bind(rl);

    try {
        const code = await questionAsync('Enter the code from that page here: ');

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        await fs.writeFile('token.json', JSON.stringify(tokens));
    } catch (error) {
        console.error('Error getting access token:', error.message);
    } finally {
        rl.close();
    }
}

module.exports = {
    authorize,
};
