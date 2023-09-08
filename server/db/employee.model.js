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
  level: String,
  position: String,
  startingDate: Date,
  currentSalary: Number,
  desiredSalary: Number,
  present: {
    type: Boolean,
    default: false,
  },
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
  kittens: [KittensSchema],
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
