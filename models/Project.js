// Project model for validation and structure
class Project {
  constructor(data) {
    this.validateProjectData(data);
    
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.teamName = data.teamName;
    this.status = data.status || 'draft';
    this.technologies = data.technologies || [];
    this.repositoryUrl = data.repositoryUrl || '';
    this.demoUrl = data.demoUrl || '';
    this.presentationUrl = data.presentationUrl || '';
  }

  validateProjectData(data) {
    if (!data.title || typeof data.title !== 'string') {
      throw new Error('Title is required and must be a string');
    }
    
    if (!data.description || typeof data.description !== 'string') {
      throw new Error('Description is required and must be a string');
    }
    
    if (!data.teamName || typeof data.teamName !== 'string') {
      throw new Error('Team name is required and must be a string');
    }
    
    const validCategories = [
      'AI/ML', 
      'Web Development', 
      'Mobile Development', 
      'Blockchain', 
      'IoT', 
      'Game Development',
      'Data Science',
      'Cybersecurity',
      'Other'
    ];
    
    if (!data.category || !validCategories.includes(data.category)) {
      throw new Error('Invalid category. Must be one of: ' + validCategories.join(', '));
    }
    
    const validStatuses = ['draft', 'in-progress', 'completed', 'submitted'];
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '));
    }
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      category: this.category,
      teamName: this.teamName,
      status: this.status,
      technologies: this.technologies,
      repositoryUrl: this.repositoryUrl,
      demoUrl: this.demoUrl,
      presentationUrl: this.presentationUrl
    };
  }
}

module.exports = Project;