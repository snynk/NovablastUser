const Batch = require("../models/Batch");
const Campaign = require("../models/campaignModel");
const mongoose = require("mongoose");

// Generate unique batch number
const generateBatchNumber = async () => {
  const date = new Date();
  const prefix = `B${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  
  const latestBatch = await Batch.findOne({
    batchNumber: { $regex: `^${prefix}` }
  }).sort({ batchNumber: -1 });
  
  const counter = latestBatch ? 
    (parseInt(latestBatch.batchNumber.substring(prefix.length)) || 0) + 1 : 1;
  
  return `${prefix}${String(counter).padStart(4, '0')}`;
};

// Helper function to get query with optional userId filter
const getQuery = (baseQuery, req) => {
  const userId = req.user?.id || req.query.userId;
  return userId ? { ...baseQuery, userId } : baseQuery;
};

// Error handler helper
const handleError = (res, error, message) => {
  console.error(`Error ${message}:`, error);
  return res.status(500).json({ success: false, message: `Error ${message}`, error: error.message });
};

exports.createBatch = async (req, res) => {
  try {
    const { campaignId, userId, totalMessages, sendRate, scheduledDate, templateUsed, batchNumber, status } = req.body;
    
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found", error: "Campaign not found" });
    }
    
    const batch = new Batch({
      batchNumber: batchNumber || await generateBatchNumber(),
      campaignId,
      userId: userId || req.user?.id,
      totalMessages: totalMessages || 0,
      sendRate: sendRate || "normal",
      scheduledDate: scheduledDate || null,
      templateUsed: templateUsed || "Default",
      status: status || "pending"
    });
    
    await batch.save();
    
    if (campaign.remaining !== undefined) {
      campaign.remaining += totalMessages;
      await campaign.save();
    }
    
    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    handleError(res, error, "creating batch");
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    const query = getQuery({}, req);
    
    const batches = await Batch.find(query)
      .populate('campaignId', 'name market response')
      .sort({ created: -1 });
    
    res.json({ success: true, data: batches });
  } catch (error) {
    handleError(res, error, "fetching batches");
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const query = getQuery({ _id: req.params.id }, req);
    
    const batch = await Batch.findOne(query)
      .populate('campaignId', 'name market response');
    
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found", error: "Batch not found" });
    }
    
    res.json({ success: true, data: batch });
  } catch (error) {
    handleError(res, error, "fetching batch");
  }
};

exports.getBatchesByCampaign = async (req, res) => {
  try {
    const query = getQuery({ campaignId: req.params.campaignId }, req);
    
    const batches = await Batch.find(query).sort({ created: -1 });
    
    res.json({ success: true, data: batches });
  } catch (error) {
    handleError(res, error, "fetching campaign batches");
  }
};

exports.updateBatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "sending", "completed", "failed", "paused"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status", error: "Invalid status" });
    }
    
    const query = getQuery({ _id: req.params.id }, req);
    
    const update = { 
      status,
      updated: Date.now(),
      ...(status === "sending" && { lastSendDate: Date.now() })
    };
    
    const batch = await Batch.findOneAndUpdate(query, update, { new: true });
    
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found", error: "Batch not found" });
    }
    
    res.json({ success: true, data: batch });
  } catch (error) {
    handleError(res, error, "updating batch status");
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const updates = { ...req.body, updated: Date.now() };
    
    // Prevent updating certain fields
    delete updates.batchNumber;
    delete updates.userId;
    delete updates.campaignId;
    delete updates.created;
    
    if (updates.status) {
      const validStatuses = ["pending", "sending", "completed", "failed", "paused"];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({ success: false, message: "Invalid status", error: "Invalid status" });
      }
    }
    
    const query = getQuery({ _id: req.params.id }, req);
    
    const batch = await Batch.findOneAndUpdate(query, updates, { new: true });
    
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found", error: "Batch not found" });
    }
    
    res.json({ success: true, data: batch });
  } catch (error) {
    handleError(res, error, "updating batch");
  }
};

exports.deleteBatch = async (req, res) => {
  try {
    const query = getQuery({ _id: req.params.id }, req);
    
    const batch = await Batch.findOne(query);
    
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found", error: "Batch not found" });
    }
    
    if (batch.status === "pending") {
      const campaign = await Campaign.findById(batch.campaignId);
      if (campaign && campaign.remaining !== undefined) {
        campaign.remaining = Math.max(0, campaign.remaining - batch.totalMessages);
        await campaign.save();
      }
    }
    
    await Batch.deleteOne(query);
    
    res.json({ success: true, message: "Batch deleted successfully" });
  } catch (error) {
    handleError(res, error, "deleting batch");
  }
};