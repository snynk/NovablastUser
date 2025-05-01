const express = require("express");
const router = express.Router();
const { getCustomerData, updateCustomerData } = require("../controllers/ProfileController");

// ✅ Get customer data
router.get("/:customerId", getCustomerData);

// ✅ Update customer data dynamically
router.put("/:customerId", updateCustomerData);

module.exports = router;
