const mongoose = require("mongoose");
const Profile = require("../models/ProfileModel");
const bcrypt = require("bcryptjs");

// ✅ Get customer data by ID
exports.getCustomerData = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    console.log("Received Customer ID:", customerId); // ✅ Debugging check
    
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: "Invalid customer ID format" });
    }
    
    const customer = await Profile.findById(new mongoose.Types.ObjectId(customerId));


    // const customerId = req.params.customerId; // Customer ID from the route
//     const customer = await Profile.findById(customerId); // Fixed: using findById instead of find



    // Removed duplicate declaration of customerId
    

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
      address2: updatedData.address2,
      state: updatedData.state,
      country: updatedData.country
    };
    
    // Filter out undefined values
    Object.keys(standardFields).forEach(key => 
      standardFields[key] === undefined && delete standardFields[key]
    );
    
    // Extract additional fields
    const additionalFields = { ...updatedData };
    Object.keys(standardFields).forEach((key) => delete additionalFields[key]);
    
    // Update profile
    const updatedCustomer = await Profile.findByIdAndUpdate(
      customerId,
      {
        ...standardFields,
        ...(Object.keys(additionalFields).length > 0 && { additionalFields })
      },
      { new: true, runValidators: true }
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

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, customerId } = req.body;

    // ✅ Ensure customerId is present
    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required." });
    }

    const user = await User.findById(customerId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // ✅ Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    // ✅ Hash new password & update
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};