const express = require('express');
const router = express.Router();
const { getAllData, createData, updateUser, deleteUser } = require('../controllers/user');

// Define the routes
router.get("/", getAllData);
router.post("/users", createData);
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

module.exports = router;
