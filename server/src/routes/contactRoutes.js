const express = require("express");
const { importContacts ,  getContactsBySample , addContact, updateContact, deleteContact } = require("../controllers/contactController");

const router = express.Router();

// POST route for importing contacts
router.post("/import", importContacts);
router.get("/:sampleName", getContactsBySample); // Fetch contacts by Sample Name


// ✅ Add a contact
router.post("/", addContact);

// ✅ Update a contact
router.put("/:contactId", updateContact);

// ✅ Delete a contact
router.delete("/:contactId", deleteContact);
module.exports = router;
