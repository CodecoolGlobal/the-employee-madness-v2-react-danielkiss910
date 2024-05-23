const mongoose = require("mongoose");

const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  level: String,
  position: String,
  isPicked: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
