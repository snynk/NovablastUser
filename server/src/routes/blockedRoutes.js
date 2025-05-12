const express = require('express');
const router = express.Router();
const blockedController = require('../controllers/blockedController');

router.get('/all', blockedController.getBlockedNumbers);
router.post('/create', blockedController.createBlockedNumber);
router.put('/:id', blockedController.editBlockedNumber);
router.delete('/:id', blockedController.deleteBlockedNumber);
router.get("/export", blockedController.exportBlockedNumbers);


module.exports = router;
