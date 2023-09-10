// models/division.js

const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  boss: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // This references the Employee model
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  location: {
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
});

const DivisionModel = mongoose.model('Division', divisionSchema);

module.exports = DivisionModel;
