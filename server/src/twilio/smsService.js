const twilioClient = require("./twilioClient");
const Message = require("../models/Message");

exports.sendSMS = async (userId, to, message) => {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log("✅ SMS Sent:", response.sid);

    // ✅ Save message in MongoDB
    const savedMessage = await Message.create({
      userId,
      type: "SMS",
      twilioNumber: process.env.TWILIO_PHONE_NUMBER,
      number: to,
      message,
      status: "Sent",
      sid: response.sid,
      price: 0.0075,
    });

    return savedMessage;
  } catch (error) {
    console.error("❌ Error Sending SMS:", error);

    // ✅ Store failed message in MongoDB
    await Message.create({
      userId,
      type: "SMS",
      twilioNumber: process.env.TWILIO_PHONE_NUMBER,
      number: to,
      message,
      status: "Failed",
      error: error.message,
    });

    throw error;
  }
};
