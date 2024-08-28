const Team = require('../models/team');
const User = require('../models/user');
const mongoose = require("mongoose");

// Create team 
exports.createTeam = async (req, res) => {
  const { name, userIds } = req.body;

  try {
    const users = await User.find({ _id: { $in: userIds }, available: true });
    const uniqueDomains = new Set(users.map(user => user.domain));
    if (uniqueDomains.size !== users.length) {
      return res.status(400).json({ message: 'Users must have unique domains.' });
    }

    const team = new Team({ name, members: users.map(user => user._id) });
    await team.save();

    res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// get the created teams data
exports.getAllTeam = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid team ID.' });
  }

  try {
    const team = await Team.findById(id).populate('members');
    if (!team) {
      return res.status(404).json({ message: 'Team not found.' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};