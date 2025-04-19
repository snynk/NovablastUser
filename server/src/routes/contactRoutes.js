const express = require("express");
const { importContacts ,  getContactsBySample } = require("../controllers/contactController");

const router = express.Router();

// POST route for importing contacts
router.post("/import", importContacts);
router.get("/:sampleName", getContactsBySample); // Fetch contacts by Sample Name

module.exports = router;
