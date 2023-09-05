const mongoose = require("mongoose");

const favoriteBrandSchema = new mongoose.Schema({
    name: String,
});

const FavoriteBrandModel = mongoose.model("FavoriteBrand", favoriteBrandSchema);

module.exports = FavoriteBrandModel;