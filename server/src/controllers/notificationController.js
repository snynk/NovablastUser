const Message = require("../models/Message");
const { sendBatchMessages } = require("../twilio/smsService");

exports.sendBatch = async (req, res) => {
  try {
    const { batchId } = req.params; // ✅ Extract batchId from route

    if (!batchId) {
      return res.status(400).json({ error: "Batch ID is required!" });
    }

    console.log(`🚀 Sending messages for batch: ${batchId}`);
    
    const result = await sendBatchMessages(batchId);
    
    res.json({ success: true, message: "Batch message processing started!", data: result });
  } catch (error) {
    console.error("❌ Error processing batch:", error);
    res.status(500).json({ error: "Failed to process batch messages." });
  }
};



exports.handleTwilioStatus = async (req, res) => {
  try {
    const { MessageSid, MessageStatus, To, Price, ErrorCode } = req.body;

    console.log(`📡 Webhook received for ${MessageSid}: ${MessageStatus}`);

    // ✅ Update message status in DB
    await Message.findOneAndUpdate(
      { sid: MessageSid },
      {
        status: MessageStatus, // ✅ Twilio status (`sent`, `delivered`, `failed`)
        price: Price || 0.0075, // ✅ Update Twilio price
        error: ErrorCode || null, // ✅ Store error if any
      }
    );

    res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).send("Error handling Twilio webhook");
  }
};

exports.handleIncomingMessage = async (req, res) => {
  try {
    const { From, Body } = req.body;
    
    console.log(`📡 Incoming SMS from ${From}: ${Body}`);

    // ✅ Store reply in database
    await Message.create({
      number: From,
      message: Body,
      type: "Received",
      
    });

    res.status(200).send("Reply stored successfully");
  } catch (error) {
    console.error("❌ Error processing incoming SMS:", error);
    res.status(500).send("Error handling Twilio incoming message webhook");
  }
};

