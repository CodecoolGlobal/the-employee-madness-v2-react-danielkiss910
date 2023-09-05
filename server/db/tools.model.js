const mongoose = require("mongoose");

const toolsSchema = new mongoose.Schema({
    name: String,
    weight: Number,
});

const ToolsModel = mongoose.model("Tools", toolsSchema);

module.exports = ToolsModel;