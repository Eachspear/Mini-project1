const mongoose = require('mongoose');

// Schema for Subject
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  papers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper'
  }]
});

// Schema for Semester
const semesterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  subjects: [subjectSchema]
});

// Schema for Year
const yearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  semesters: [semesterSchema]
});

// Schema for Branch
const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  years: [yearSchema]
});

// Define models
const Subject = mongoose.model('Subject', subjectSchema);
const Semester = mongoose.model('Semester', semesterSchema);
const Year = mongoose.model('Year', yearSchema);
const Branch = mongoose.model('Branch', branchSchema);

module.exports = { Subject, Semester, Year, Branch };
