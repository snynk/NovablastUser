// server/routes/dripAutomationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllDripAutomations,
  getDripAutomation,
  createDripAutomation,
  updateDripAutomation,
  deleteDripAutomation,
  searchDripAutomations
} = require('../controllers/DripAutomationController');

// Define routes
router.get('/', getAllDripAutomations);
router.get('/search', searchDripAutomations);
router.get('/:id', getDripAutomation);
router.post('/', createDripAutomation);
router.put('/:id', updateDripAutomation);
router.delete('/:id', deleteDripAutomation);

module.exports = router;