const express = require("express");
const router = express.Router();
const { getCustomerData, updateCustomerData } = require("../controllers/ProfileController");

// Route to get customer data
router.get("/:customerId", getCustomerData);

// Route to update customer data
router.put("/:customerId", updateCustomerData);

module.exports = router;
