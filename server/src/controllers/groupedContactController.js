const Contact = require("../models/contactModel");
const GroupedContact = require("../models/groupedContactModel");

// Fetch grouped contact lists
exports.getGroupedContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

    // Group contacts by SampleName
    const groupedContacts = contacts.reduce((acc, contact) => {
      if (!acc[contact.SampleName]) {
        acc[contact.SampleName] = {
          sampleName: contact.SampleName,
          totalRows: 0,
          created: contact.created,
          duplicates: 0, // Future implementation based on duplicate phone numbers
          mobilesType: contact.mobilesType || null,
          landlinesType: contact.landlinesType || null,
          voip: contact.voip || null,
          dnc: contact.dnc || null,
        };
      }
      acc[contact.SampleName].totalRows += 1;
      return acc;
    }, {});

    return res.status(200).json(Object.values(groupedContacts));
  } catch (error) {
    console.error("Error fetching grouped contacts:", error);
    return res.status(500).json({ error: "Failed to retrieve contact list." });
  }
};

// Delete a contact group by SampleName
exports.deleteGroupedContact = async (req, res) => {
  try {
    const { sampleName } = req.params;
    
    // Delete all contacts under the given SampleName
    await Contact.deleteMany({ SampleName: sampleName });

    return res.status(200).json({ message: `All contacts under '${sampleName}' deleted successfully.` });
  } catch (error) {
    console.error("Error deleting grouped contact:", error);
    return res.status(500).json({ error: "Failed to delete contacts." });
  }
};
