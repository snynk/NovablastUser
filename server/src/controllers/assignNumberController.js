const AssignNumber = require('../models/AssignNumber');

// Get all assign numbers
exports.getAllAssignNumbers = async (req, res) => {
  try {
    const assignNumbers = await AssignNumber.find();
    res.status(200).json({
      success: true,
      count: assignNumbers.length,
      data: assignNumbers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single assign number by ID
exports.getAssignNumberById = async (req, res) => {
  try {
    const assignNumber = await AssignNumber.findOne({ id: req.params.id });
    
    if (!assignNumber) {
      return res.status(404).json({
        success: false,
        error: 'Assign Number not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assignNumber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new assign number
exports.createAssignNumber = async (req, res) => {
  try {
    // Find the highest ID to increment
    const lastRecord = await AssignNumber.findOne().sort('-id');
    const newId = lastRecord ? lastRecord.id + 1 : 1;
    
    // Set the new ID
    req.body.id = newId;
    
    const assignNumber = await AssignNumber.create(req.body);
    res.status(201).json({
      success: true,
      data: assignNumber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update assign number
exports.updateAssignNumber = async (req, res) => {
  try {
    // Update the updated_at timestamp
    req.body.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const assignNumber = await AssignNumber.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!assignNumber) {
      return res.status(404).json({
        success: false,
        error: 'Assign Number not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assignNumber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete assign number
exports.deleteAssignNumber = async (req, res) => {
  try {
    const assignNumber = await AssignNumber.findOneAndDelete({ id: req.params.id });

    if (!assignNumber) {
      return res.status(404).json({
        success: false,
        error: 'Assign Number not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};