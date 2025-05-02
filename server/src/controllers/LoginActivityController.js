const LoginActivity = require("../models/LoginActivityModel");

// ✅ Get login activity by user ID (last 20 logins)
exports.getLoginActivity = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required." });
    }

    const loginLogs = await LoginActivity.find({ userId: customerId })
      .sort({ loginTime: -1 }) // ✅ Sort newest first
      .limit(20); // ✅ Retrieve last 20 logins

    return res.status(200).json(loginLogs);
  } catch (error) {
    console.error("Error fetching login activity:", error);
    res.status(500).json({ error: "Failed to retrieve login activity." });
  }
};

// ✅ Record a new login activity
exports.recordLoginActivity = async (userId, ipAddress = "Unknown", deviceInfo = "Unknown") => {
  try {
    const newLogin = new LoginActivity({
      userId,
      ipAddress,
      deviceInfo,
    });

    await newLogin.save();
    console.log("Login activity recorded successfully!");
  } catch (error) {
    console.error("Error recording login activity:", error);
  }
};
