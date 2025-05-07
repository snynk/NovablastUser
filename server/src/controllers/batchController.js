const Batch = require("../models/Batch");
const Campaign = require("../models/Campaign");
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
    const { campaignId, totalMessages, sendRate, scheduledDate, templateUsed } = req.body;
    
    // Validate campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    
    // Generate batch number
    const batchNumber = await generateBatchNumber();
    
    // Create batch
    const batch = new Batch({
      batchNumber,
      campaignId,
      userId: req.user.id, // Assuming req.user is set by auth middleware
      totalMessages,
      sendRate: sendRate || "normal",
      scheduledDate: scheduledDate || null,
      templateUsed: templateUsed || "Default"
    });
    
    await batch.save();
    
    // Update campaign remaining count
    campaign.remaining += totalMessages;
    await campaign.save();
    
    res.status(201).json(batch);
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ message: "Error creating batch", error: error.message });
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ userId: req.user.id })
      .populate('campaignId', 'name market response')
      .sort({ created: -1 });
    
    res.json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ message: "Error fetching batches", error: error.message });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    }).populate('campaignId', 'name market response');
    
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    
    res.json(batch);
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ message: "Error fetching batch", error: error.message });
  }
};

exports.getBatchesByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const batches = await Batch.find({ 
      campaignId,
      userId: req.user.id
    }).sort({ created: -1 });
    
    res.json(batches);
  } catch (error) {
    console.error("Error fetching campaign batches:", error);
    res.status(500).json({ message: "Error fetching campaign batches", error: error.message });
  }
};

exports.updateBatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ["pending", "sending", "completed", "failed", "paused"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const batch = await Batch.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { 
        status,
        updated: Date.now(),
        ...(status === "sending" && { lastSendDate: Date.now() })
      },
      { new: true }
    );
    
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    
    res.json(batch);
  } catch (error) {
    console.error("Error updating batch status:", error);
    res.status(500).json({ message: "Error updating batch status", error: error.message });
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
    
    const batch = await Batch.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true }
    );
    
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    
    res.json(batch);
  } catch (error) {
    console.error("Error updating batch:", error);
    res.status(500).json({ message: "Error updating batch", error: error.message });
  }
};

exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    
    const batch = await Batch.findOne({ _id: id, userId: req.user.id });
    
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    
    // Update campaign remaining count if batch is pending
    if (batch.status === "pending") {
      const campaign = await Campaign.findById(batch.campaignId);
      if (campaign) {
        campaign.remaining -= batch.totalMessages;
        if (campaign.remaining < 0) campaign.remaining = 0;
        await campaign.save();
      }
    }
    
    await Batch.deleteOne({ _id: id, userId: req.user.id });
    
    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Error deleting batch:", error);
    res.status(500).json({ message: "Error deleting batch", error: error.message });
  }
};