// server/controllers/DripAutomationController.js
const DripAutomation = require('../models/DripAutomation');

// Get all drip automations
exports.getAllDripAutomations = async (req, res) => {
  try {
    const automations = await DripAutomation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: automations.length,
      data: automations
    });
  } catch (error) {
    console.error('Error fetching drip automations:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single drip automation
exports.getDripAutomation = async (req, res) => {
  try {
    const automation = await DripAutomation.findById(req.params.id);
    
    if (!automation) {
      return res.status(404).json({
        success: false,
        message: 'Drip automation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: automation
    });
  } catch (error) {
    console.error('Error fetching drip automation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create drip automation
exports.createDripAutomation = async (req, res) => {
  try {
    const { name, messages } = req.body;
    
    if (!name || !messages || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and at least one message'
      });
    }
    
    const newAutomation = await DripAutomation.create({
      name,
      messages,
      createdAt: Date.now()
    });
    
    res.status(201).json({
      success: true,
      data: newAutomation
    });
  } catch (error) {
    console.error('Error creating drip automation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update drip automation
exports.updateDripAutomation = async (req, res) => {
  try {
    const { name, messages } = req.body;
    
    if (!name || !messages || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and at least one message'
      });
    }
    
    const automation = await DripAutomation.findById(req.params.id);
    
    if (!automation) {
      return res.status(404).json({
        success: false,
        message: 'Drip automation not found'
      });
    }
    
    const updatedAutomation = await DripAutomation.findByIdAndUpdate(
      req.params.id,
      { name, messages, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedAutomation
    });
  } catch (error) {
    console.error('Error updating drip automation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete drip automation
exports.deleteDripAutomation = async (req, res) => {
  try {
    const automation = await DripAutomation.findById(req.params.id);
    
    if (!automation) {
      return res.status(404).json({
        success: false,
        message: 'Drip automation not found'
      });
    }
    
    await DripAutomation.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Drip automation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting drip automation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Search drip automations
exports.searchDripAutomations = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }
    
    const automations = await DripAutomation.find({
      name: { $regex: query, $options: 'i' }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: automations.length,
      data: automations
    });
  } catch (error) {
    console.error('Error searching drip automations:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};