const mongoose = require("mongoose");

const boardGameSchema = new mongoose.Schema({
    name: String,
    maxPlayers: Number,
});

const BoardGameModel = mongoose.model("BoardGames", boardGameSchema);

module.exports = BoardGameModel;