const db = require('../database');
const User = require('../models/User');

class UserService {
  // Get all users
  getAllUsers() {
    return db.findAll('users');
  }

  // Get user by ID
  getUserById(id) {
    const user = db.findById('users', id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Get user by email
  getUserByEmail(email) {
    const user = db.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Create new user
  createUser(userData) {
    // Check if user with email already exists
    const existingUser = db.users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate user data
    const userModel = new User(userData);
    
    // Create user in database
    const newUser = db.create('users', userModel.toJSON());
    return newUser;
  }

  // Update user
  updateUser(id, userData) {
    const existingUser = this.getUserById(id);
    
    // If email is being updated, check for conflicts
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = db.users.find(user => user.email === userData.email && user.id !== id);
      if (emailExists) {
        throw new Error('User with this email already exists');
      }
    }

    // Validate the updated data
    const updatedData = { ...existingUser, ...userData };
    const userModel = new User(updatedData);
    
    // Update in database
    const updatedUser = db.update('users', id, userModel.toJSON());
    return updatedUser;
  }

  // Delete user
  deleteUser(id) {
    const user = this.getUserById(id);
    const deleted = db.delete('users', id);
    
    if (!deleted) {
      throw new Error('Failed to delete user');
    }
    
    return { message: 'User deleted successfully' };
  }

  // Get users by role
  getUsersByRole(role) {
    return db.findAll('users').filter(user => user.role === role);
  }

  // Get users by team
  getUsersByTeam(teamName) {
    return db.findAll('users').filter(user => user.team === teamName);
  }
}

module.exports = new UserService();