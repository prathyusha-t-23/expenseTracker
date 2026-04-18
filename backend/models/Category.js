const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // If null, it's a predefined (global) category
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
