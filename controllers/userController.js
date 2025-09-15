const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const { role, team } = req.query;
    
    let users;
    if (role) {
      users = userService.getUsersByRole(role);
    } else if (team) {
      users = userService.getUsersByTeam(team);
    } else {
      users = userService.getAllUsers();
    }
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = userService.getUserById(req.params.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  try {
    const newUser = userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = userService.updateUser(req.params.id, req.body);
    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const result = userService.deleteUser(req.params.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/users/email/:email - Get user by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = userService.getUserByEmail(req.params.email);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;