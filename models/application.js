
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address']
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true,
    uppercase: true,
    maxlength: 30
  },
  internship: {
    type: String,
    required: [true, 'Select an internship'],
    enum: [
      'Frontend Developer Intern',
      'Backend Developer Intern',
      'Full Stack Developer Intern',
      'AI/ML Intern',
      'Data Analyst Intern'
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
