const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    // Return both predefined categories (user: null) and user's custom categories
    const categories = await Category.find({
      $or: [{ user: null }, { user: req.user._id }]
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    const categoryExists = await Category.findOne({ name, user: req.user._id });
    if (categoryExists) {
        return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      user: req.user._id
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  addCategory
};
