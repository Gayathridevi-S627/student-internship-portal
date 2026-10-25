const express = require('express');
const router = express.Router();
const Application = require('../models/application');

router.get('/applications', async (req, res, next) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
});

router.get('/applications/:id', async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    next(error);
  }
});

router.post('/applications', async (req, res, next) => {
  try {
    const { name, email, rollNumber, internship } = req.body;

    if (!name || !email || !rollNumber || !internship) {
      return res.status(400).json({
        message: 'Name, email, roll number, and internship are required'
      });
    }

    const application = await Application.create({
      name: name.trim(),
      email: email.trim(),
      rollNumber: rollNumber.trim(),
      internship
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

module.exports = router;
