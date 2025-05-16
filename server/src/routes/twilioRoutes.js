const express = require("express");
const { sendBatch } = require("../controllers/notificationController");

const router = express.Router();

// ✅ Use `batchId` as a route parameter instead of request body
router.post("/send-batch/:batchId", sendBatch);

module.exports = router;
