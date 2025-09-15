const db = require('../database');
const Project = require('../models/Project');

class ProjectService {
  // Get all projects
  getAllProjects() {
    return db.findAll('projects');
  }

  // Get project by ID
  getProjectById(id) {
    const project = db.findById('projects', id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  // Create new project
  createProject(projectData) {
    // Validate project data
    const projectModel = new Project(projectData);
    
    // Create project in database
    const newProject = db.create('projects', projectModel.toJSON());
    return newProject;
  }

  // Update project
  updateProject(id, projectData) {
    const existingProject = this.getProjectById(id);
    
    // Validate the updated data
    const updatedData = { ...existingProject, ...projectData };
    const projectModel = new Project(updatedData);
    
    // Update in database
    const updatedProject = db.update('projects', id, projectModel.toJSON());
    return updatedProject;
  }

  // Delete project
  deleteProject(id) {
    const project = this.getProjectById(id);
    const deleted = db.delete('projects', id);
    
    if (!deleted) {
      throw new Error('Failed to delete project');
    }
    
    return { message: 'Project deleted successfully' };
  }

  // Get projects by team
  getProjectsByTeam(teamName) {
    return db.findProjectsByTeam(teamName);
  }

  // Get projects by category
  getProjectsByCategory(category) {
    return db.findProjectsByCategory(category);
  }

  // Get projects by status
  getProjectsByStatus(status) {
    return db.findAll('projects').filter(project => project.status === status);
  }

  // Update project status
  updateProjectStatus(id, status) {
    const validStatuses = ['draft', 'in-progress', 'completed', 'submitted'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '));
    }

    return this.updateProject(id, { status });
  }

  // Search projects by title or description
  searchProjects(searchTerm) {
    const projects = db.findAll('projects');
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    
    return projects.filter(project => 
      project.title.toLowerCase().includes(lowercaseSearchTerm) ||
      project.description.toLowerCase().includes(lowercaseSearchTerm)
    );
  }

  // Get project statistics
  getProjectStats() {
    return db.getStats();
  }
}

module.exports = new ProjectService();