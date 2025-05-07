const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const auth = require('../middleware/auth');

// All routes are protected with auth middleware
router.use(auth);

// Get all batches
router.get('/', batchController.getAllBatches);

// Get single batch
router.get('/:id', batchController.getBatchById);

// Get batches by campaign
router.get('/campaign/:campaignId', batchController.getBatchesByCampaign);

// Create a new batch
router.post('/', batchController.createBatch);

// Update batch
router.put('/:id', batchController.updateBatch);

// Update batch status
router.patch('/:id/status', batchController.updateBatchStatus);

// Delete batch
router.delete('/:id', batchController.deleteBatch);

module.exports = router;