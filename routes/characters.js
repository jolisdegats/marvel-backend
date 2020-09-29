const express = require("express");
const axios = require("axios");
const router = express.Router();
const MD5 = require("crypto-js/md5");
require("dotenv").config();

router.get("/characters", async (req, res) => {
  try {
    let ts = req.query.ts;
    let limit = req.query.limit;
    let offset = req.query.offset;
    let orderBy = req.query.orderBy;
    req.query.nameStartsWith === undefined
      ? (search = "")
      : (search = "&nameStartsWith=" + req.query.nameStartsWith);

    const apiKey = process.env.MARVEL_API_KEY;
    const privateKey = process.env.MARVEL_PRIVATE_API_KEY;
    const hash = MD5(ts + privateKey + apiKey);

    marvelUrl =
      "http://gateway.marvel.com/v1/public/characters?ts=" +
      ts +
      "&apikey=" +
      apiKey +
      "&hash=" +
      hash +
      "&limit=" +
      limit +
      "&offset=" +
      offset +
      "&orderBy=" +
      orderBy +
      search;

    const response = await axios.get(`${marvelUrl}`);

    res.json(response.data);
  } catch (err) {
    console.log(err.message);
  }
});

// Recupérer l'id puis faire une requete axios a l'api marvel

router.get("/character/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const ts = req.query.ts;
    const apiKey = process.env.MARVEL_API_KEY;
    const privateKey = process.env.MARVEL_PRIVATE_API_KEY;
    const hash = MD5(ts + privateKey + apiKey);

    characterReq = `http://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${apiKey}&hash=${hash}`;

    const response = await axios.get(`${characterReq}`);
    res.json(response.data);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
