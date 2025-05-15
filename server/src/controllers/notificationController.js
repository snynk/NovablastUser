const { sendSMS } = require("../twilio/smsService");

exports.notifyUser = async (req, res) => {
  try {
    const { userId, phone, message } = req.body;
    const savedMessage = await sendSMS(userId, phone, message);
    res.json({ success: true, message: "SMS sent successfully!", data: savedMessage });
  } catch (error) {
    res.status(500).json({ error: "Failed to send SMS." });
  }
};
