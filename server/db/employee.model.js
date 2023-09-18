// https://mongoosejs.com/
const mongoose = require("mongoose");

const { Schema } = mongoose;

// Nest kittens schema within employee schema
const KittensSchema = new Schema({
  name: String,
  weight: Number,
});

const EmployeeSchema = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  address: {
    country: String,
    city: String,
    street: String,
    zipCode: Number,
  },
  level: String,
  position: String,
  startingDate: Date,
  currentSalary: Number,
  desiredSalary: Number,
  present: {
    type: Boolean,
    default: false,
  },
  pets: [{
    name: {
      type: String,
      required: true
    },
    sortOfAnimal: {
      type: String,
      required: true
    },
  }],
  assignedEquipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment", // Make sure these exactly match what is defined in each Schema
  },
  favoriteBrand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FavoriteBrand",
  },
  favouriteColour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Colours",
  },
  favoriteTools: [{
    type: Schema.Types.ObjectId,
    ref: "Tools"
  }],
  favoriteBoardGame: {
    type: Schema.Types.ObjectId,
    ref: "BoardGames"
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division'
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location"
  },
  kittens: [KittensSchema],
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
