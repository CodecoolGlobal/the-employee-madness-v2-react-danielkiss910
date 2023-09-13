const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema ({
    city: String,
    country: String,
});

const LocationModel = mongoose.model("Location", locationSchema);

module.exports = LocationModel;