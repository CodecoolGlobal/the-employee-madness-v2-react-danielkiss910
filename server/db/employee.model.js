// https://mongoosejs.com/
const mongoose = require("mongoose");

const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  level: String,
  position: String,
  startingDate: Date,
  currentSalary: Number,
  favouriteColour: String,
  desiredSalary: Number,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
