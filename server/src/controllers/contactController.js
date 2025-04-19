const Contact = require('../models/contactModel')
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

exports.importContacts = async (req, res) => {
    try {
      const { sampleName, contacts } = req.body; // Contacts data from the frontend
      console.log("Contacts received:", contacts);
      if (!sampleName) {
        return res.status(400).json({ error: "Sample name is required." });
      }
// Process the contacts data
      if (!contacts || contacts.length === 0) {
        return res.status(400).json({ error: "No contact data provided." });
      }
  
      // Validate required fields for each contact
      for (const contact of contacts) {
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
        // if (!contact.Phone2) missingFields.push("Phone2");
        // if (!contact.Phone3) missingFields.push("Phone3");
  
        if (missingFields.length > 0) {
          return res.status(400).json({
            error: `Missing required fields: ${missingFields.join(", ")}`,
          });
        }
         // Add SampleName to each contact
      contact.SampleName = sampleName;
      }
      console.log("Attempting to insert contacts into MongoDB...");

      // Insert contacts into MongoDB
      await Contact.insertMany(contacts);
  
      return res.status(201).json({ message: "Contacts imported successfully!" });
    } catch (error) {
      console.error("Error importing contacts:", error);
      return res.status(500).json({ error: "Failed to import contacts." });
    }
  };
  