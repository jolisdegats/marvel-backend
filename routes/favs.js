const express = require("express");
const axios = require("axios");
const router = express.Router();
const MD5 = require("crypto-js/md5");
require("dotenv").config();

const Fav = require("../models/Fav");

router.get("/favs", async (req, res) => {
  const comicsIdArr = [];
  let comicsArr = [];
  const charactersIdArr = [];
  let charactersArr = [];
  const favourites = {};

  try {
    // console.log(req.params.searchBar);
    //     if (req.params.searchBar){

    // }

    const allFav = await Fav.find().sort({ date: -1 });
    for (let i = 0; i < allFav.length; i++) {
      if (allFav[i].category === "comics") {
        comicsIdArr.push(allFav[i].idMarvel);
      } else {
        charactersIdArr.push(allFav[i].idMarvel);
      }
    }

    for (let i = 0; i < comicsIdArr.length; i++) {
      let id = comicsIdArr[i];
      let ts = req.query.ts;
      const apiKey = process.env.MARVEL_API_KEY;
      const privateKey = process.env.MARVEL_PRIVATE_API_KEY;
      const hash = MD5(ts + privateKey + apiKey);

      comicsReq = `http://gateway.marvel.com/v1/public/comics/${id}?ts=${ts}&apikey=${apiKey}&hash=${hash}`;

      const comicsFavs = await axios.get(`${comicsReq}`);
      comicsArr = comicsArr.concat(comicsFavs.data.data.results);
    }

    for (let i = 0; i < charactersIdArr.length; i++) {
      let id = charactersIdArr[i];
      let ts = req.query.ts;
      const apiKey = process.env.MARVEL_API_KEY;
      const privateKey = process.env.MARVEL_PRIVATE_API_KEY;
      const hash = MD5(ts + privateKey + apiKey);
      charactersReq = `http://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${apiKey}&hash=${hash}`;

      const charactersFavs = await axios.get(`${charactersReq}`);
      charactersArr = charactersArr.concat(charactersFavs.data.data.results);
    }

    favourites.comics = comicsArr;
    favourites.characters = charactersArr;

    res.json(favourites);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/favs/create", async (req, res) => {
  try {
    const newFav = await new Fav({
      idMarvel: req.fields.item.idMarvel,
      title: req.fields.item.title,
      category: req.fields.category,
      date: new Date(),
    });
    await newFav.save();

    res.status(200).json({ message: "Fav successfully created" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.post("/favs/remove", async (req, res) => {
  try {
    const favToRemove = await Fav.find({ idMarvel: req.fields.idMarvel });
    await favToRemove[0].deleteOne();
    res.status(200).json("Fav successfully removed");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get("/favexists", async (req, res) => {
  await Fav.exists({ idMarvel: req.query.idMarvel }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
