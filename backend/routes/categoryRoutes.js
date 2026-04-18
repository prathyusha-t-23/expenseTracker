const express = require('express');
const router = express.Router();
const { getCategories, addCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCategories)
  .post(protect, addCategory);

module.exports = router;
