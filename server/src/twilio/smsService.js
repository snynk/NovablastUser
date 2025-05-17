const twilioClient = require("./twilioClient");
const Message = require("../models/Message");
const Batch = require("../models/Batch");
const Campaign = require("../models/campaignModel");
const Contact = require("../models/contactModel");
const Template = require("../models/templateModel");

exports.sendBatchMessages = async (batchId) => {
  try {
    console.log(`🚀 Processing batch: ${batchId}`);

    // ✅ Fetch Batch Details
    const batch = await Batch.findById(batchId);
    if (!batch) throw new Error("Batch not found");

    // ✅ Fetch Campaign Details
    const campaign = await Campaign.findById(batch.campaignId);
    if (!campaign) throw new Error("Campaign not found");

    // ✅ Fetch Contacts from Contact List
    const contacts = await Contact.find({ SampleName: campaign.contactListId });
    if (!contacts.length) throw new Error("No contacts found for this campaign");

    // ✅ Fetch Template
    const template = await Template.findById(batch.templateUsed);
    if (!template) throw new Error("Template not found");

    const messages = template.messages.map(msg => msg.content);
    if (!messages.length) throw new Error("No messages found in template");

    const totalMessages = messages.length;

    console.log(`🚀 Sending ${contacts.length} messages using ${totalMessages} template variations`);

    // ✅ Round-robin sending logic
    let messagesSent = 0;

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const messageIndex = i % totalMessages; // Cycle messages
      const messageContent = messages[messageIndex];

      const phoneNumbers = [contact.Phone1, contact.Phone2, contact.Phone3].filter(Boolean);

      for (const phone of phoneNumbers) {
        try {
          const response = await twilioClient.messages.create({
            body: messageContent,
            from: campaign.callForwardingNumber,
            to: phone,
          });

          console.log(`✅ SMS Sent to ${phone}: ${response.sid}`);

          // ✅ Save sent message in MongoDB with Twilio response values
          await Message.create({
            userId: batch.userId,
            type: "sent", // ✅ Set message type
            twilioNumber: campaign.callForwardingNumber,
            number: phone,
            message: messageContent,
            status: response.status || "Sent", // ✅ Status from Twilio
            sid: response.sid,
            price: response.price || 0.0075, // ✅ Price from Twilio
            batchId: batchId,
            error: null, // ✅ No error for successful send
          });

          messagesSent++;

        } catch (error) {
          console.error(`❌ Error Sending SMS to ${phone}:`, error);

          // ✅ Store failed message in MongoDB with error details
          await Message.create({
            userId: batch.userId,
            type: "sent", // ✅ Maintain message type
            twilioNumber: campaign.callForwardingNumber,
            number: phone,
            message: messageContent,
            status: "Failed", // ✅ Explicit failure status
            sid: null,
            price: 0, // ✅ No price charged for failed messages
            batchId: batchId,
            error: error.message || "Unknown error", // ✅ Capture Twilio error details
          });
        }
      }
    }

    // ✅ Update Batch Status & Messages Sent Count
    await Batch.findByIdAndUpdate(batchId, {
      messagesSent,
      status: "completed",
    });

    console.log("🎉 Batch Processing Completed!");
    return { success: true, message: "Batch messages sent successfully" };

  } catch (error) {
    console.error("❌ Error Processing Batch:", error);
    return { success: false, error: error.message };
  }
};
