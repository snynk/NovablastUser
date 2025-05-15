const express = require("express");
const { notifyUser } = require("../controllers/notificationController");

const router = express.Router();
router.post("/send-sms", notifyUser);

module.exports = router;  
