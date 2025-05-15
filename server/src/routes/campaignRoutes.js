const express = require("express");
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  searchCampaigns,
  createFollowUpCampaign,
  getParentCampaigns,
  getContactLists,
  getContactListPhoneNumbers,
  getMarketsForDropdown
} = require("../controllers/campaignController");

// Optional authentication middleware
// const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create new campaigns
router.post("/", createCampaign);
router.post("/follow-up", createFollowUpCampaign);

// Get all campaigns with optional filtering
router.get("/", getCampaigns);

// Get parent campaigns (for follow-up selection)
router.get("/parents", getParentCampaigns);

// Get contact lists for dropdown
router.get("/contact-lists", getContactLists);

// Get markets for dropdown
router.get("/markets", getMarketsForDropdown);

// Get phone numbers for a specific contact list
router.get("/contact-lists/:sampleName/phones", getContactListPhoneNumbers);

// Search campaigns
router.get("/search", searchCampaigns);

// Get, update, and delete campaigns by ID
router.get("/:campaignId", getCampaignById);
router.put("/:campaignId", updateCampaign);
router.delete("/:campaignId", deleteCampaign);

module.exports = router;