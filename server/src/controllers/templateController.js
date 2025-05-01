const Template = require("../models/templateModel");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create a new template
exports.createTemplate = async (req, res) => {
  try {
    const { name, type, messages, templateType } = req.body;

    // Validate required fields
    if (!name || !type || !messages || !templateType) {
      return res.status(400).json({ 
        error: "Missing required fields. Name, type, messages, and templateType are required." 
      });
    }

    // Validate message structure
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: "At least one message is required." 
      });
    }

    // Add userId if authentication is implemented
    const userId = req.user ? req.user._id : null;
    
    const template = new Template({
      name,
      type,
      messages,
      templateType,
      userId,
      // Set default values for other fields
      delivery: 0,
      response: 0
    });

    const savedTemplate = await template.save();
    return res.status(201).json(savedTemplate);
  } catch (error) {
    console.error("Error creating template:", error);
    return res.status(500).json({ error: error.message || "Failed to create template" });
  }
};

// Get all templates with optional filtering
exports.getTemplates = async (req, res) => {
  try {
    const { templateType, category, type } = req.query;
    
    // Create filter object
    const filter = {};
    
    // Add filters if they exist
    if (templateType) filter.templateType = templateType;
    if (category) filter.category = category;
    if (type) filter.type = type;
    
    // Add user filter if authentication is implemented
    if (req.user) filter.userId = req.user._id;
    
    const templates = await Template.find(filter).sort({ created: -1 });
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({ error: "Failed to retrieve templates." });
  }
};

// Get a single template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = await Template.findById(templateId);
    
    if (!template) {
      return res.status(404).json({ error: "Template not found." });
    }
    
    return res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return res.status(500).json({ error: "Failed to retrieve template." });
  }
};

// Update a template
exports.updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const updateData = { ...req.body, updated: Date.now() };
    
    const updatedTemplate = await Template.findByIdAndUpdate(
      templateId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedTemplate) {
      return res.status(404).json({ error: "Template not found." });
    }
    
    return res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error("Error updating template:", error);
    return res.status(500).json({ error: "Failed to update template." });
  }
};

// Delete a template
exports.deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const deletedTemplate = await Template.findByIdAndDelete(templateId);
    
    if (!deletedTemplate) {
      return res.status(404).json({ error: "Template not found." });
    }
    
    return res.status(200).json({ message: "Template deleted successfully." });
  } catch (error) {
    console.error("Error deleting template:", error);
    return res.status(500).json({ error: "Failed to delete template." });
  }
};

// Search templates
exports.searchTemplates = async (req, res) => {
  try {
    const { query, templateType } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }
    
    const filter = {
      name: { $regex: query, $options: 'i' }
    };
    
    // Add templateType filter if provided
    if (templateType) {
      filter.templateType = templateType;
    }
    
    // Add user filter if authentication is implemented
    if (req.user) {
      filter.userId = req.user._id;
    }
    
    const templates = await Template.find(filter).sort({ created: -1 });
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error searching templates:", error);
    return res.status(500).json({ error: "Failed to search templates." });
  }
};