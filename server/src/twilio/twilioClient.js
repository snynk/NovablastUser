const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const username = process.env.TWILIO_USERNAME; // ✅ Check if username is required

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials are missing. Check your .env file.");
}

const twilioClient = username
  ? new twilio(accountSid, authToken, { username }) // ✅ Include username if needed
  : new twilio(accountSid, authToken);

module.exports = twilioClient;
