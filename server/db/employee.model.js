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
  desiredSalary: Number,
  favouriteColour: String,
  present: {
    type: Boolean,
    default: false,
  },
  assignedEquipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
  },
  favoriteBrand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FavoriteBrand",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
