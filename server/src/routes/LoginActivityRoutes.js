const express = require("express");
const router = express.Router();
const { getLoginActivity } = require("../controllers/LoginActivityController");

// ✅ Route to get login activity for a user
router.get("/:customerId", getLoginActivity);

module.exports = router;
