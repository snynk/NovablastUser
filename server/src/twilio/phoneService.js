const twilioClient = require("./twilioClient"); // ✅ Import Twilio client

exports.buyTwilioNumber = async (areaCode) => {
  try {
    // ✅ Fetch available Twilio numbers in the US for the given area code
    const availableNumbers = await twilioClient.availablePhoneNumbers("US").local.list({ areaCode });

    if (!availableNumbers.length) {
      throw new Error(`No available Twilio numbers found for area code ${areaCode}. Try a different one.`);
    }

    // ✅ Purchase the first available Twilio number
    const twilioNumber = availableNumbers[0].phoneNumber;
    const purchaseResponse = await twilioClient.incomingPhoneNumbers.create({
      phoneNumber: twilioNumber,
    });

    console.log("✅ Twilio Number Purchased:", purchaseResponse.phoneNumber);
    return purchaseResponse.phoneNumber;
  } catch (error) {
    console.error("❌ Error Buying Twilio Number:", error);
    throw error;
  }
};
