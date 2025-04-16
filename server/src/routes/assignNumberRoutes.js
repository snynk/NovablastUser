const express = require('express');
const router = express.Router();
const {
  getAllAssignNumbers,
  getAssignNumberById,
  createAssignNumber,
  updateAssignNumber,
  deleteAssignNumber
} = require('../controllers/assignNumberController');

router.route('/')
  .get(getAllAssignNumbers)
  .post(createAssignNumber);

router.route('/:id')
  .get(getAssignNumberById)
  .put(updateAssignNumber)
  .delete(deleteAssignNumber);

module.exports = router;