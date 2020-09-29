const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(formidable());
app.use(cors());

const comics = require("./routes/comics");
const characters = require("./routes/characters");
const favs = require("./routes/favs");
app.use(comics);
app.use(characters);
app.use(favs);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
