const express = require("express");
const router = express.Router();
const { getCustomerData, updateCustomerData ,changePassword } = require("../controllers/ProfileController");

// ✅ Get customer data
router.get("/:customerId", getCustomerData);

// ✅ Update customer data dynamically
router.put("/:customerId", updateCustomerData);

router.put("/:customerId/change-password", changePassword);


module.exports = router;
