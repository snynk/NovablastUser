const express = require("express");
const { importContacts } = require("../controllers/contactController");

const router = express.Router();

// POST route for importing contacts
router.post("/import", importContacts);

module.exports = router;
