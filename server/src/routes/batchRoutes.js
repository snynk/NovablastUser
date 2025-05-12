const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');

// Get all batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json({ success: true, data: batches });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch batches', error: error.message });
  }
});

// Get a single batch by ID
router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: batch });
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch batch', error: error.message });
  }
});

// Create a new batch
router.post('/', async (req, res) => {
  try {
    const newBatch = new Batch(req.body);
    const savedBatch = await newBatch.save();
    res.status(201).json({ success: true, data: savedBatch });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(400).json({ success: false, message: 'Failed to create batch', error: error.message });
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
    if (!updatedBatch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: updatedBatch });
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(400).json({ success: false, message: 'Failed to update batch', error: error.message });
  }
});

// Delete a batch
router.delete('/:id', async (req, res) => {
  try {
    const deletedBatch = await Batch.findByIdAndDelete(req.params.id);
    if (!deletedBatch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, data: deletedBatch });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ success: false, message: 'Failed to delete batch', error: error.message });
  }
});

module.exports = router;