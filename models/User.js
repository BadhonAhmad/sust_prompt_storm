// User model for validation and structure
class User {
  constructor(data) {
    this.validateUserData(data);
    
    this.name = data.name;
    this.email = data.email;
    this.role = data.role || 'participant';
    this.team = data.team || null;
    this.skills = data.skills || [];
    this.bio = data.bio || '';
  }

  validateUserData(data) {
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Name is required and must be a string');
    }
    
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }
    
    const validRoles = ['participant', 'mentor', 'judge', 'organizer'];
    if (data.role && !validRoles.includes(data.role)) {
      throw new Error('Invalid role. Must be one of: ' + validRoles.join(', '));
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
      team: this.team,
      skills: this.skills,
      bio: this.bio
    };
  }
}

module.exports = User;