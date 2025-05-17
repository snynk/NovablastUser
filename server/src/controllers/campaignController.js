// Update to campaignController.js
const Campaign = require("../models/campaignModel");
const Contact = require("../models/contactModel");
const Market = require("../models/Market"); // Import Market model
const mongoose = require("mongoose");
require("dotenv").config();

// Helper functions
const validateId = id => mongoose.Types.ObjectId.isValid(id);
const getFilter = (req, { market, isFollowUp } = {}) => {
  const filter = {};
  if (market) filter.market = market;
  if (isFollowUp !== undefined) filter.isFollowUp = isFollowUp === "true";
  if (req.user) filter.userId = req.user._id;
  return filter;
};

// Check contact list exists and get total contacts
const verifyContactList = async (sampleName) => {
  const contactList = await Contact.findOne({ SampleName: sampleName });
  if (!contactList) throw { status: 404, message: "Contact list not found" };
  const totalContacts = await Contact.countDocuments({ SampleName: sampleName });
  return { contactList, totalContacts };
};

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const { name, marketId , callForwardingNumber, contactListId } = req.body;

    // Validate required fields
    if (!name || !marketId  || !contactListId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get call forwarding number from market if not provided
    let finalCallForwardingNumber = callForwardingNumber;
    if (!finalCallForwardingNumber) {
     const marketData = await Market.findById(marketId); // ✅ Corrected query

      if (marketData) {
        finalCallForwardingNumber = marketData.callForwardingNumber;
      } else {
        return res.status(400).json({ error: "Call forwarding number is required when market doesn't exist" });
      }
    }

    // Verify contact list exists
    const { totalContacts } = await verifyContactList(contactListId);
    
    const campaign = new Campaign({
      name,
      marketId,
      callForwardingNumber: finalCallForwardingNumber,
      contactListId,
      userId: req.user?._id,
      sent: 0,
      remaining: totalContacts,
      hot: 0,
      drip: 0,
      deliverability: "98.5%",
      response: "0%"
    });

    const savedCampaign = await campaign.save();
    return res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    return res.status(error.status || 500).json({ 
      error: error.message || "Failed to create campaign" 
    });
  }
};

// Create a follow-up campaign
exports.createFollowUpCampaign = async (req, res) => {
  try {
    const { campaign: parentCampaignId, market, month, title, contactListId } = req.body;

    // Validate required fields
    if (!parentCampaignId || !market || !month || !title || !contactListId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate parent campaign
    if (!validateId(parentCampaignId)) {
      return res.status(400).json({ error: "Invalid parent campaign ID" });
    }
    
    const parentCampaign = await Campaign.findById(parentCampaignId);
    if (!parentCampaign) {
      return res.status(404).json({ error: "Parent campaign not found" });
    }

    // Get call forwarding number from market if needed
    let callForwardingNumber = parentCampaign.callForwardingNumber;
    if (!callForwardingNumber) {
      const marketData = await Market.findOne({ name: market });
      if (marketData) {
        callForwardingNumber = marketData.callForwardingNumber;
      }
    }

    // Verify contact list exists
    const { totalContacts } = await verifyContactList(contactListId);
    
    const followUpCampaign = new Campaign({
      name: title,
      market,
      callForwardingNumber,
      contactListId,
      userId: req.user?._id,
      isFollowUp: true,
      parentCampaign: parentCampaignId,
      monthWithoutResponse: month,
      sent: 0,
      remaining: totalContacts,
      hot: 0,
      drip: 0,
      deliverability: "98.5%",
      response: "0%"
    });

    const savedCampaign = await followUpCampaign.save();
    return res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating follow-up campaign:", error);
    return res.status(error.status || 500).json({ 
      error: error.message || "Failed to create follow-up campaign" 
    });
  }
};

// Get all campaigns with optional filtering
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find(getFilter(req, req.query)).sort({ created: -1 });
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return res.status(500).json({ error: "Failed to retrieve campaigns" });
  }
};

// Get all contact lists for dropdown
exports.getContactLists = async (req, res) => {
  try {
    const contactLists = await Contact.aggregate([
      { $group: { _id: "$SampleName", count: { $sum: 1 } } },
      { $project: { _id: 0, id: "$_id", name: "$_id", count: 1 } },
      { $sort: { name: 1 } }
    ]);
    
    return res.status(200).json(contactLists);
  } catch (error) {
    console.error("Error fetching contact lists:", error);
    return res.status(500).json({ error: "Failed to retrieve contact lists" });
  }
};

// Get a single campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    if (!validateId(campaignId)) {
      return res.status(400).json({ error: "Invalid campaign ID format" });
    }
    
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    
    return res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return res.status(500).json({ error: "Failed to retrieve campaign" });
  }
};

// Update a campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    if (!validateId(campaignId)) {
      return res.status(400).json({ error: "Invalid campaign ID format" });
    }
    
    const updateData = { ...req.body, updated: Date.now() };
    
    // If market is being updated but not the call forwarding number, get from market
    if (updateData.market && !updateData.callForwardingNumber) {
      const marketData = await Market.findOne({ name: updateData.market });
      if (marketData) {
        updateData.callForwardingNumber = marketData.callForwardingNumber;
      }
    }
    
    // Verify contact list if provided
    if (updateData.contactListId) {
      await verifyContactList(updateData.contactListId);
    }
    
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedCampaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    
    return res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    return res.status(error.status || 500).json({ 
      error: error.message || "Failed to update campaign" 
    });
  }
};

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    if (!validateId(campaignId)) {
      return res.status(400).json({ error: "Invalid campaign ID format" });
    }
    
    const deletedCampaign = await Campaign.findByIdAndDelete(campaignId);
    
    if (!deletedCampaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    
    return res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return res.status(500).json({ error: "Failed to delete campaign" });
  }
};

// Search campaigns
exports.searchCampaigns = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    const filter = {
      name: { $regex: query, $options: 'i' },
      ...getFilter(req, req.query)
    };
    
    const campaigns = await Campaign.find(filter).sort({ created: -1 });
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error searching campaigns:", error);
    return res.status(500).json({ error: "Failed to search campaigns" });
  }
};

// Get all parent campaigns
exports.getParentCampaigns = async (req, res) => {
  try {
    const filter = getFilter(req, { isFollowUp: false });
    const campaigns = await Campaign.find(filter).sort({ created: -1 });
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching parent campaigns:", error);
    return res.status(500).json({ error: "Failed to retrieve parent campaigns" });
  }
};

// Get contact list phone numbers
exports.getContactListPhoneNumbers = async (req, res) => {
  try {
    const { sampleName } = req.params;
    
    if (!sampleName) {
      return res.status(400).json({ error: "SampleName is required" });
    }
    
    const contacts = await Contact.find({ SampleName: sampleName });
    
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ error: "No contacts found" });
    }
    
    const phoneNumbers = [];
    const addPhone = (contact, phone, type, index) => {
      if (phone && !phoneNumbers.some(p => p.number === phone)) {
        phoneNumbers.push({
          id: `${contact._id}-${index}`,
          number: phone,
          type,
          contact: `${contact.FirstName} ${contact.LastName}`
        });
      }
    };
    
    contacts.forEach(contact => {
      addPhone(contact, contact.Phone1, 'Primary', 1);
      addPhone(contact, contact.Phone2, 'Secondary', 2);
      addPhone(contact, contact.Phone3, 'Additional', 3);
    });
    
    return res.status(200).json(phoneNumbers);
  } catch (error) {
    console.error("Error fetching phone numbers:", error);
    return res.status(500).json({ error: "Failed to retrieve phone numbers" });
  }
};

// Get all markets for dropdown
exports.getMarketsForDropdown = async (req, res) => {
  try {
    const filter = {};
    if (req.user) filter.customerId = req.user._id;
    
    const markets = await Market.find(filter).select('name callForwardingNumber').sort({ name: 1 });
    return res.status(200).json(markets);
  } catch (error) {
    console.error("Error fetching markets:", error);
    return res.status(500).json({ error: "Failed to retrieve markets" });
  }
};