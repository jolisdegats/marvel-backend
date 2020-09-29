const mongoose = require("mongoose");

const Fav = mongoose.model("Fav", {
  idMarvel: { type: String, unique: true },
  title: String,
  category: String,
  date: Date,
});

module.exports = Fav;
