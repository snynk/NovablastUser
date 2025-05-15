const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');

// Error handler helper
const handleError = (res, error, action, status = 500) => {
  console.error(`Error ${action}:`, error);
  return res.status(status).json({ 
    success: false, 
    message: `Failed to ${action}`, 
    error: error.message 
  });
};

// Get all batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json({ success: true, data: batches });
  } catch (error) {
    handleError(res, error, 'fetch batches');
  }
});

// Get a single batch by ID
router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, data: batch });
  } catch (error) {
    handleError(res, error, 'fetch batch');
  }
});

// Create a new batch
router.post('/', async (req, res) => {
  try {
    const savedBatch = await new Batch(req.body).save();
    res.status(201).json({ success: true, data: savedBatch });
  } catch (error) {
    handleError(res, error, 'create batch', 400);
  }
});

// Update a batch
router.put('/:id', async (req, res) => {
  try {
    const updatedBatch = await Batch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBatch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, data: updatedBatch });
  } catch (error) {
    handleError(res, error, 'update batch', 400);
  }
});

// Delete a batch
router.delete('/:id', async (req, res) => {
  try {
    const deletedBatch = await Batch.findByIdAndDelete(req.params.id);
    if (!deletedBatch) return res.status(404).json({ success: false, message: 'Batch not found' });
    res.json({ success: true, data: deletedBatch });
  } catch (error) {
    handleError(res, error, 'delete batch');
  }
});

module.exports = router;