const mongoose = require("mongoose");
const Profile = require("../models/ProfileModel");

// ✅ Get customer data by ID
exports.getCustomerData = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    console.log("Received Customer ID:", customerId); // ✅ Debugging check

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: "Invalid customer ID format" });
    }

    const customer = await Profile.findById(new mongoose.Types.ObjectId(customerId));

    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    return res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer data:", error); // ✅ Log full error details
    res.status(500).json({ error: "Failed to retrieve customer data.", details: error.message });
  }
};

// ✅ Update customer data (Handles dynamic fields)
exports.updateCustomerData = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updatedData = req.body;

    // Extract standard fields
    const standardFields = {
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      status: updatedData.status,
      address: updatedData.address,
    };

    // Extract additional fields
    const additionalFields = { ...updatedData };
    Object.keys(standardFields).forEach((key) => delete additionalFields[key]);

    // Update profile
    const updatedCustomer = await Profile.findByIdAndUpdate(
      customerId,
      { ...standardFields, $set: { additionalFields } }, // ✅ Adds dynamic fields
      { new: true, upsert: true } // ✅ Ensures new fields are added dynamically
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    return res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer data:", error);
    res.status(500).json({ error: "Failed to update customer data." });
  }
};
