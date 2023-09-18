const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: Number,
    value: Number,
});

const CarModel = mongoose.model("Cars", carSchema);

module.exports = CarModel;