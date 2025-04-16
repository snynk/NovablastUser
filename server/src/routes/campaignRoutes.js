const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

// GET all campaigns
router.get('/', campaignController.getAllCampaigns);

// POST create a new campaign
router.post('/', campaignController.createCampaign);

// PUT update a campaign by ID
router.put('/:id', campaignController.updateCampaign);

// DELETE a campaign by ID
router.delete('/:id', campaignController.deleteCampaign);

module.exports = router;
