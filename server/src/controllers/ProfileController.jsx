const Customer = require("../models/ProfileModel");

// ✅ Get customer data by ID
exports.getCustomerData = async (req, res) => {
  try {
    const customerId = req.params.customerId; // Customer ID from the route
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    return res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer data:", error);
    res.status(500).json({ error: "Failed to retrieve customer data." });
  }
};

// ✅ Update customer data
exports.updateCustomerData = async (req, res) => {
  try {
    const customerId = req.params.customerId; // Customer ID from the route
    const updatedData = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updatedData, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    return res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer data:", error);
    res.status(500).json({ error: "Failed to update customer data." });
  }
};
