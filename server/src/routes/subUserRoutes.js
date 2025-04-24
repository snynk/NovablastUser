const express = require("express");
const { createSubUser, getSubUsersByCustomer, updateSubUser, deleteSubUser } = require("../controllers/subUserController");
const router = express.Router();

router.post("/", createSubUser); // ✅ Create a subuser linked to a customer
router.get("/:customerId", getSubUsersByCustomer); // ✅ Fetch users for a customer
router.put("/:subUserId", updateSubUser);
router.delete("/:subUserId", deleteSubUser);

module.exports = router;
