const express = require('express');
const router = express.Router();
const dripController = require('../controller/dripController');

router.post('/', dripController.createDrip);
router.get('/', dripController.getDrips);

module.exports = router;
