const User = require('../models/user');
const mongoose = require("mongoose")

// Retrieve all users with pagination, filtering, and search
exports.getAllData = async (req, res) => {
  const { page = 1, limit = 20, search = '', domain, gender, available } = req.query;

  const filter = {};
  if (domain) filter.domain = domain;
  if (gender) filter.gender = gender;
  if (available) filter.available = available === 'true';
  if (search) {
    const searchTerms = search.split(' ').filter(term => term.trim() !== '');
    filter.$or = searchTerms.map(term => ({
      $or: [
        { first_name: new RegExp(term, 'i') },
        { last_name: new RegExp(term, 'i') }
      ]
    }));
  }
  try {
    const users = await User.find(filter)
      .limit(parseInt(limit)) 
      .skip((parseInt(page) - 1) * parseInt(limit)) 
      .exec();
    
    const count = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
exports.createData = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Update an existing user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  let { first_name, last_name, email, domain, gender, available } = req.body;

  try {
    // Convert the 'available' field to a boolean
    available = available === "Available" ? true : false;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { first_name, last_name, email, domain, gender, available },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};



// Delete a user
exports.deleteUser =  async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', userId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
};