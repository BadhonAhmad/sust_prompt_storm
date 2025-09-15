const express = require('express');
const router = express.Router();
const projectService = require('../services/projectService');

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const { category, status, team, search } = req.query;
    
    let projects;
    if (search) {
      projects = projectService.searchProjects(search);
    } else if (category) {
      projects = projectService.getProjectsByCategory(category);
    } else if (status) {
      projects = projectService.getProjectsByStatus(status);
    } else if (team) {
      projects = projectService.getProjectsByTeam(team);
    } else {
      projects = projectService.getAllProjects();
    }
    
    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/projects/stats - Get project statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = projectService.getProjectStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = projectService.getProjectById(req.params.id);
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  try {
    const newProject = projectService.createProject(req.body);
    res.status(201).json({
      success: true,
      data: newProject,
      message: 'Project created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const updatedProject = projectService.updateProject(req.params.id, req.body);
    res.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// PATCH /api/projects/:id/status - Update project status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    const updatedProject = projectService.updateProjectStatus(req.params.id, status);
    res.json({
      success: true,
      data: updatedProject,
      message: 'Project status updated successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const result = projectService.deleteProject(req.params.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const statusCode = error.message === 'Project not found' ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;