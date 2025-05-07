const express = require("express");
const { 
  importContacts, 
  getContactsBySample, 
  addContact, 
  updateContact, 
  deleteContact,
  getContactCountByListId // Add the new controller function
} = require("../controllers/contactController");

const router = express.Router();

// POST route for importing contacts
router.post("/import", importContacts);

// GET route to fetch contacts by Sample Name
router.get("/:sampleName", getContactsBySample);

// GET route to fetch contact count by list ID
router.get("/count/:listId", getContactCountByListId);

// Add a contact
router.post("/", addContact);

// Update a contact
router.put("/:contactId", updateContact);

// Delete a contact
router.delete("/:contactId", deleteContact);


module.exports = router;