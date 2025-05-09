const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

router.get('/all', tagController.getTags);
router.post('/create', tagController.createTag);
router.put('/:id', tagController.editTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router;
