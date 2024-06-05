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
  equipment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment'
    }
  ],
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
