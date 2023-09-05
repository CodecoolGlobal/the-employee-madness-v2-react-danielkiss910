const mongoose = require("mongoose");

const colourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

const ColourModel = mongoose.model("Colours", colourSchema);

module.exports = ColourModel;