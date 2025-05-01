const express = require("express");
const { 
  createTemplate, 
  getTemplates, 
  getTemplateById, 
  updateTemplate, 
  deleteTemplate,
  searchTemplates
} = require("../controllers/templateController");

// Optional authentication middleware
// const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new template
router.post("/", createTemplate);

// Get all templates with optional filtering
router.get("/", getTemplates);

// Search templates
router.get("/search", searchTemplates);

// Get, update, and delete templates by ID
router.get("/:templateId", getTemplateById);
router.put("/:templateId", updateTemplate);
router.delete("/:templateId", deleteTemplate);

module.exports = router;