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
