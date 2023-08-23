const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
    name: String,
    type: String,
    amount: Number,
    created: {
        type: Date,
        default: Date.now,
    },
});

const EquipmentModel = mongoose.model("Equipment", equipmentSchema);

module.exports = EquipmentModel;