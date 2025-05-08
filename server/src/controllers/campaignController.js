const Campaign = require("../models/campaignModel");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { name, market, callForwardingNumber } = req.body;

    // Validate required fields
    if (!name || !market || !callForwardingNumber) {
      return res.status(400).json({ 
        error: "Missing required fields. Name, market, and callForwardingNumber are required." 
      });
    }

    // Add userId if authentication is implemented
    const userId = req.user ? req.user._id : null;
    
    const campaign = new Campaign({
      name,
      market,
      callForwardingNumber,
      userId,
      // Default values will be set by the model
      sent: Math.floor(Math.random() * 5000), // Mock data for demonstration
      remaining: Math.floor(Math.random() * 3000), // Mock data for demonstration
      hot: Math.floor(Math.random() * 100), // Mock data for demonstration
      drip: 0,
      deliverability: (90 + Math.random() * 10).toFixed(2) + "%", // Mock data (90-100%)
      response: (5 + Math.random() * 25).toFixed(2) + "%" // Mock data (5-30%)
    });

    const savedCampaign = await campaign.save();
    return res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    return res.status(500).json({ error: error.message || "Failed to create campaign" });
  }
};

// Create a follow-up campaign
exports.createFollowUpCampaign = async (req, res) => {
  try {
    const { campaign: parentCampaignId, market, month, title } = req.body;

    // Validate required fields
    if (!parentCampaignId || !market || !month || !title) {
      return res.status(400).json({ 
        error: "Missing required fields. Parent campaign, market, month, and title are required." 
      });
    }

    // Check if parent campaign exists
    const parentCampaign = await Campaign.findById(parentCampaignId);
    if (!parentCampaign) {
      return res.status(404).json({ error: "Parent campaign not found." });
    }

    // Add userId if authentication is implemented
    const userId = req.user ? req.user._id : null;
    
    const followUpCampaign = new Campaign({
      name: title,
      market,
      callForwardingNumber: parentCampaign.callForwardingNumber,
      userId,
      isFollowUp: true,
      parentCampaign: parentCampaignId,
      monthWithoutResponse: month,
      // Default values will be set by the model
      sent: Math.floor(Math.random() * 2000), // Mock data for demonstration
      remaining: Math.floor(Math.random() * 1000), // Mock data for demonstration
      hot: Math.floor(Math.random() * 50), // Mock data for demonstration
      drip: 0,
      deliverability: (90 + Math.random() * 10).toFixed(2) + "%", // Mock data (90-100%)
      response: (5 + Math.random() * 25).toFixed(2) + "%" // Mock data (5-30%)
    });

    const savedCampaign = await followUpCampaign.save();
    return res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating follow-up campaign:", error);
    return res.status(500).json({ error: error.message || "Failed to create follow-up campaign" });
  }
};

// Get all campaigns with optional filtering
exports.getCampaigns = async (req, res) => {
  try {
    const { market, isFollowUp } = req.query;
    
    // Create filter object
    const filter = {};
    
    // Add filters if they exist
    if (market) filter.market = market;
    if (isFollowUp !== undefined) filter.isFollowUp = isFollowUp === "true";
    
    // Add user filter if authentication is implemented
    if (req.user) filter.userId = req.user._id;
    
    const campaigns = await Campaign.find(filter).sort({ created: -1 });
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return res.status(500).json({ error: "Failed to retrieve campaigns." });
  }
};

// Get a single campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await Campaign.findById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }
    
    return res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return res.status(500).json({ error: "Failed to retrieve campaign." });
  }
};

// Update a campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updateData = { ...req.body, updated: Date.now() };
    
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedCampaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }
    
    return res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    return res.status(500).json({ error: "Failed to update campaign." });
  }
};

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const deletedCampaign = await Campaign.findByIdAndDelete(campaignId);
    
    if (!deletedCampaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }
    
    return res.status(200).json({ message: "Campaign deleted successfully." });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return res.status(500).json({ error: "Failed to delete campaign." });
  }
};

// Search campaigns
exports.searchCampaigns = async (req, res) => {
  try {
    const { query, market, isFollowUp } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }
    
    const filter = {
      name: { $regex: query, $options: 'i' }
    };
    
    // Add additional filters if provided
    if (market) filter.market = market;
    if (isFollowUp !== undefined) filter.isFollowUp = isFollowUp === "true";
    
    // Add user filter if authentication is implemented
    if (req.user) {
      filter.userId = req.user._id;
    }
    
    const campaigns = await Campaign.find(filter).sort({ created: -1 });
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error searching campaigns:", error);
    return res.status(500).json({ error: "Failed to search campaigns." });
  }
};

// Get all parent campaigns (for follow-up selection)
exports.getParentCampaigns = async (req, res) => {
  try {
    const filter = {
      isFollowUp: false
    };
    
    // Add user filter if authentication is implemented
    if (req.user) filter.userId = req.user._id;
    
    const campaigns = await Campaign.find(filter).sort({ created: -1 });
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching parent campaigns:", error);
    return res.status(500).json({ error: "Failed to retrieve parent campaigns." });
  }
};