const express = require('express');
const router = express.Router();
const blockedController = require('../controllers/blockedController');

router.get('/', blockedController.getBlockedNumbers);
router.post('/', blockedController.createBlockedNumber);
router.put('/:id', blockedController.editBlockedNumber);
router.delete('/:id', blockedController.deleteBlockedNumber);

module.exports = router;
