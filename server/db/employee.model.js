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
  present: {
    type: Boolean,
    default: false,
  },
  assignedEquipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
