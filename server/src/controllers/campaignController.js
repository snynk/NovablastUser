const Campaign = require("../models/campaignModel");
const Contact = require("../models/contactModel");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { name, market, callForwardingNumber, contactListId } = req.body;

    // Validate required fields
    if (!name || !market || !callForwardingNumber || !contactListId) {
      return res.status(400).json({ 
        error: "Missing required fields. Name, market, callForwardingNumber, and contactListId are required." 
      });
    }

    // Find contacts by SampleName instead of _id
    const contactList = await Contact.findOne({ SampleName: contactListId });
    if (!contactList) {
      return res.status(404).json({ error: "Selected contact list not found." });
    }

    // Add userId if authentication is implemented
    const userId = req.user ? req.user._id : null;
    
    // Calculate total contacts with the same SampleName
    const totalContacts = await Contact.countDocuments({ SampleName: contactListId });
    
    const campaign = new Campaign({
      name,
      market,
      callForwardingNumber,
      contactListId: contactListId, // Store the SampleName as string
      userId,
      // Set values based on the contact list size
      sent: 0,
      remaining: totalContacts,
      hot: 0,
      drip: 0,
      deliverability: "98.5%", // Default starting value
      response: "0%" // Will be updated as responses come in
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
    const { campaign: parentCampaignId, market, month, title, contactListId } = req.body;

    // Validate required fields
    if (!parentCampaignId || !market || !month || !title || !contactListId) {
      return res.status(400).json({ 
        error: "Missing required fields. Parent campaign, market, month, title, and contactListId are required." 
      });
    }

    // Check if parent campaign exists - this requires a valid ObjectID
    if (!mongoose.Types.ObjectId.isValid(parentCampaignId)) {
      return res.status(400).json({ error: "Invalid parent campaign ID format." });
    }
    
    const parentCampaign = await Campaign.findById(parentCampaignId);
    if (!parentCampaign) {
      return res.status(404).json({ error: "Parent campaign not found." });
    }

    // Find contacts by SampleName instead of _id
    const contactList = await Contact.findOne({ SampleName: contactListId });
    if (!contactList) {
      return res.status(404).json({ error: "Selected contact list not found." });
    }

    // Add userId if authentication is implemented
    const userId = req.user ? req.user._id : null;
    
    // Calculate total contacts with the same SampleName
    const totalContacts = await Contact.countDocuments({ SampleName: contactListId });
    
    const followUpCampaign = new Campaign({
      name: title,
      market,
      callForwardingNumber: parentCampaign.callForwardingNumber,
      contactListId: contactListId, // Store the SampleName as string
      userId,
      isFollowUp: true,
      parentCampaign: parentCampaignId,
      monthWithoutResponse: month,
      // Set values based on the contact list size
      sent: 0,
      remaining: totalContacts,
      hot: 0,
      drip: 0,
      deliverability: "98.5%", // Default starting value
      response: "0%" // Will be updated as responses come in
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
    
    const campaigns = await Campaign.find(filter)
      .sort({ created: -1 });
      
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return res.status(500).json({ error: "Failed to retrieve campaigns." });
  }
};

// Get all contact lists (Sample Names) for dropdown selection
exports.getContactLists = async (req, res) => {
  try {
    // Get distinct sample names
    const contactLists = await Contact.aggregate([
      { $group: { _id: "$SampleName", count: { $sum: 1 } } },
      { $project: { _id: 0, id: "$_id", name: "$_id", count: 1 } },
      { $sort: { name: 1 } }
    ]);
    
    return res.status(200).json(contactLists);
  } catch (error) {
    console.error("Error fetching contact lists:", error);
    return res.status(500).json({ error: "Failed to retrieve contact lists." });
  }
};

// Get a single campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ error: "Invalid campaign ID format." });
    }
    
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
    
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ error: "Invalid campaign ID format." });
    }
    
    const updateData = { ...req.body, updated: Date.now() };
    
    // If contactListId is being updated, verify it exists as a SampleName
    if (updateData.contactListId) {
      const contactList = await Contact.findOne({ SampleName: updateData.contactListId });
      if (!contactList) {
        return res.status(404).json({ error: "Selected contact list not found." });
      }
    }
    
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
    
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ error: "Invalid campaign ID format." });
    }
    
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
    
    const campaigns = await Campaign.find(filter)
      .sort({ created: -1 });
      
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
    
    const campaigns = await Campaign.find(filter)
      .sort({ created: -1 });
      
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching parent campaigns:", error);
    return res.status(500).json({ error: "Failed to retrieve parent campaigns." });
  }
};