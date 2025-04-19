const express = require("express");
const { getGroupedContacts, deleteGroupedContact } = require("../controllers/groupedContactController");

const router = express.Router();

// GET grouped contact list
router.get("/", getGroupedContacts);

// DELETE contact group by SampleName
router.delete("/:sampleName", deleteGroupedContact);

module.exports = router;
