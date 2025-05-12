const Batch = require("../models/Batch");
const Campaign = require("../models/campaignModel");
const mongoose = require("mongoose");

// Generate unique batch number
const generateBatchNumber = async () => {
  const date = new Date();
  const prefix = `B${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  
  // Find the latest batch with this prefix
  const latestBatch = await Batch.findOne({
    batchNumber: { $regex: `^${prefix}` }
  }).sort({ batchNumber: -1 });
  
  let counter = 1;
  if (latestBatch && latestBatch.batchNumber) {
    const currentCounter = parseInt(latestBatch.batchNumber.substring(prefix.length));
    if (!isNaN(currentCounter)) {
      counter = currentCounter + 1;
    }
  }
  
  return `${prefix}${String(counter).padStart(4, '0')}`;
};

exports.createBatch = async (req, res) => {
  try {
    const { campaignId, userId, totalMessages, sendRate, scheduledDate, templateUsed, batchNumber, status } = req.body;
    
    // Validate campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found", error: "Campaign not found" });
    }
    
    // Generate batch number if not provided
    const finalBatchNumber = batchNumber || await generateBatchNumber();
    
    // Create batch with validated fields
    const batch = new Batch({
      batchNumber: finalBatchNumber,
      campaignId,
      userId: userId || req.user?.id, // Use provided userId or from auth middleware
      totalMessages: totalMessages || 0,
      sendRate: sendRate || "normal",
      scheduledDate: scheduledDate || null,
      templateUsed: templateUsed || "Default",
      status: status || "pending" // Make sure it's a valid enum value
    });
    
    await batch.save();
    
    // Update campaign remaining count
    if (campaign.remaining !== undefined) {
      campaign.remaining += totalMessages;
      await campaign.save();
    }
    
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ success: false, message: "Error creating batch", error: error.message });
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    // Get user ID from request user or query parameter
    const userId = req.user?.id || req.query.userId;
    
    // Build query object
    const query = userId ? { userId } : {};
    
    const batches = await Batch.find(query)
      .populate('campaignId', 'name market response')
      .sort({ created: -1 });
    
    res.json({ success: true, data: batches });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ success: false, message: "Error fetching batches", error: error.message });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    // Get user ID from request user or query parameter
    const userId = req.user?.id || req.query.userId;
    
    // Build query object
    const query = { _id: req.params.id };
    if (userId) query.userId = userId;
    
    const batch = await Batch.findOne(query)
      .populate('campaignId', 'name market response');
    
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found", error: "Batch not found" });
    }
    
    res.json({ success: true, data: batch });
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ success: false, message: "Error fetching batch", error: error.message });
  }
};

exports.getBatchesByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    // Get user ID from request user or query parameter
    const userId = req.user?.id || req.query.userId;
    
    // Build query object
    const query = { campaignId };
    if (userId) query.userId = userId;
    
    const batches = await Batch.find(query).sort({ created: -1 });
    
    res.json({ success: true, data: batches });
  } catch (error) {
    console.error("Error fetching campaign batches:", error);
    res.status(500).json({ success: false, message: "Error fetching campaign batches", error: error.message });
  }
};

exports.updateBatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ["pending", "sending", "completed", "failed", "paused"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status", error: "Invalid status" });
    }
    
    // Get user ID from request user or query parameter
    const userId = req.user?.id || req.query.userId;
    
    // Build query object
    const query = { _id: id };
    if (userId) query.userId = userId;
    
    const batch = await Batch.findOneAndUpdate(
      query,
      { 
        status,
        updated: Date.now(),
        ...(status === "sending" && { lastSendDate: Date.now() })
      },
      { new: true }
    );
    
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found", error: "Batch not found" });
    }
    
    res.json({ success: true, data: batch });
  } catch (error) {
    console.error("Error updating batch status:", error);
    res.status(500).json({ success: false, message: "Error updating batch status", error: error.message });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent updating certain fields
    delete updates.batchNumber;
    delete updates.userId;
    delete updates.campaignId;
    delete updates.created;
    
    updates.updated = Date.now();
    
    // Validate status if being updated
    if (updates.status) {
      const validStatuses = ["pending", "sending", "completed", "failed", "paused"];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({ success: false, message: "Invalid status", error: "Invalid status" });
      }
    }
    
    // Get user ID from request user or query parameter
    const userId = req.user?.id || req.query.userId;
    
    // Build query object
    const query = { _id: id };
    if (userId) query.userId = userId;
    
    const batch = await Batch.findOneAndUpdate(
      query,
      updates,
      { new: true }
    );
    
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found", error: "Batch not found" });
    }
    
    res.json({ success: true, data: batch });
  } catch (error) {
    console.error("Error updating batch:", error);
    res.status(500).json({ success: false, message: "Error updating batch", error: error.message });
  }
};

exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user ID from request user or query parameter
    const userId = req.user?.id || req.query.userId;
    
    // Build query object
    const query = { _id: id };
    if (userId) query.userId = userId;
    
    const batch = await Batch.findOne(query);
    
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found", error: "Batch not found" });
    }
    
    // Update campaign remaining count if batch is pending
    if (batch.status === "pending") {
      const campaign = await Campaign.findById(batch.campaignId);
      if (campaign && campaign.remaining !== undefined) {
        campaign.remaining -= batch.totalMessages;
        if (campaign.remaining < 0) campaign.remaining = 0;
        await campaign.save();
      }
    }
    
    await Batch.deleteOne(query);
    
    res.json({ success: true, message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Error deleting batch:", error);
    res.status(500).json({ success: false, message: "Error deleting batch", error: error.message });
  }
};