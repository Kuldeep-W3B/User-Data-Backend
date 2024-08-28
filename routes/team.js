const express = require('express');
const router = express.Router();
const { getAllTeam, createTeam } = require('../controllers/team');

// Define the routes
router.get("/team/:id", getAllTeam);
router.post("/team", createTeam);

module.exports = router;