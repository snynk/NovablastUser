const express = require("express");
const { sendBatch, handleTwilioStatus, handleIncomingMessage } = require("../controllers/notificationController");

const router = express.Router();

// ✅ Use `batchId` as a route parameter instead of request body
router.post("/send-batch/:batchId", sendBatch);

// ✅ Twilio Webhook for SMS Status Updates
router.post("/twilio/status", handleTwilioStatus);

// ✅ Twilio Webhook for Incoming Messages
router.post("/twilio/incoming", handleIncomingMessage);

module.exports = router;
