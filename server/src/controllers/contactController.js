const Contact = require("../models/contactModel");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

exports.importContacts = async (req, res) => {
  try {
    const { sampleName, contacts } = req.body; // Contacts data from the frontend
    console.log("Contacts received:", contacts);

    if (!sampleName) {
      return res.status(400).json({ error: "Sample name is required." });
    }

    if (!contacts || contacts.length === 0) {
      return res.status(400).json({ error: "No contact data provided." });
    }

    // Validate and process each contact before inserting
    const processedContacts = contacts.map((contact) => {
      const missingFields = [];
      if (!contact.FirstName) missingFields.push("FirstName");
      if (!contact.LastName) missingFields.push("LastName");
      if (!contact.City) missingFields.push("City");
      if (!contact.State) missingFields.push("State");
      if (!contact.Zip) missingFields.push("Zip");
      if (!contact.PropertyAddress) missingFields.push("PropertyAddress");
      if (!contact.PropertyCity) missingFields.push("PropertyCity");
      if (!contact.PropertyState) missingFields.push("PropertyState");
      if (!contact.PropertyZip) missingFields.push("PropertyZip");
      if (!contact.Phone1) missingFields.push("Phone1");

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      return { ...contact, SampleName: sampleName }; // Add SampleName dynamically
    });

    console.log("Attempting to insert contacts into MongoDB...");

    // Insert validated contacts into MongoDB
    await Contact.insertMany(processedContacts);

    return res.status(201).json({ message: "Contacts imported successfully!" });
  } catch (error) {
    console.error("Error importing contacts:", error);
    return res.status(500).json({ error: error.message || "Failed to import contacts." });
  }
};

// Fetch contacts associated with a specific SampleName
exports.getContactsBySample = async (req, res) => {
  try {
    const { sampleName } = req.params;

    // Find contacts matching the Sample Name (List Name)
    const contacts = await Contact.find({ SampleName: sampleName });

    return res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts for sample:", error);
    return res.status(500).json({ error: "Failed to retrieve contacts." });
  }
};


// ✅ Add a new contact
exports.addContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    return res.status(201).json(savedContact);
  } catch (error) {
    console.error("Error adding contact:", error);
    return res.status(500).json({ error: "Failed to add contact." });
  }
};

// ✅ Update an existing contact
exports.updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!updatedContact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return res.status(500).json({ error: "Failed to update contact." });
  }
};

// ✅ Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    return res.status(200).json({ message: "Contact deleted successfully." });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({ error: "Failed to delete contact." });
  }
};
