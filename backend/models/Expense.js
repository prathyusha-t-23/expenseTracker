const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01 // Minimum expense amount
  },
  type: {
    type: String,
    enum: ['Expense', 'Income'],
    default: 'Expense'
  },
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
