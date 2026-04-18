const Expense = require('../models/Expense');

// @desc    Get all expenses for a user (with optional filtering)
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, search, type } = req.query;

    const query = { user: req.user._id };

    if (category && category !== 'All') {
        query.category = category;
    }
    
    if (type && type !== 'All') {
        query.type = type;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly summary/stats
// @route   GET /api/expenses/summary
// @access  Private
const getExpenseSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const expenses = await Expense.find({ user: userId });
        
        let totalIncome = 0;
        let totalExpense = 0;

        expenses.forEach(tx => {
            if (tx.type === 'Income') totalIncome += tx.amount;
            else totalExpense += tx.amount;
        });

        const balance = totalIncome - totalExpense;

        res.status(200).json({
            totalIncome,
            totalExpense,
            balance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Add an expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description, type } = req.body;

    if (!title || !amount || !category || !date) {
        return res.status(400).json({ message: 'Please provide all required fields' })
    }

    const expense = new Expense({
      user: req.user._id,
      title,
      amount,
      category,
      type: type || 'Expense',
      date,
      description
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await expense.deleteOne();
    res.status(200).json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  getExpenseSummary,
  addExpense,
  updateExpense,
  deleteExpense
};
