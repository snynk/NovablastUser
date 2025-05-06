const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/', marketController.getMarkets);
router.post('/', marketController.createMarket);
router.put('/:id', marketController.editMarket);
router.delete('/:id', marketController.deleteMarket);
router.post('/create', marketController.createMarketWithDLC);
router.get('/all', marketController.getMarketsWithDLC);

module.exports = router;
