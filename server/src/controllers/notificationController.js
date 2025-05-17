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
