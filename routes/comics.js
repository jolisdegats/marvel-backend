const express = require("express");
const axios = require("axios");
const router = express.Router();
const MD5 = require("crypto-js/md5");
require("dotenv").config();

router.get("/comics", async (req, res) => {
  try {
    let ts = req.query.ts;
    let limit = req.query.limit;
    let offset = req.query.offset;
    let orderBy = req.query.orderBy;
    req.query.titleStartsWith === undefined
      ? (search = "")
      : (search = "&titleStartsWith=" + req.query.titleStartsWith);

    const apiKey = process.env.MARVEL_API_KEY;
    const privateKey = process.env.MARVEL_PRIVATE_API_KEY;
    const hash = MD5(ts + privateKey + apiKey);

    marvelUrl =
      "http://gateway.marvel.com/v1/public/comics?ts=" +
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

router.get("/comic/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const ts = req.query.ts;
    const apiKey = process.env.MARVEL_API_KEY;
    const privateKey = process.env.MARVEL_PRIVATE_API_KEY;
    const hash = MD5(ts + privateKey + apiKey);

    comicReq = `http://gateway.marvel.com/v1/public/comics/${id}?ts=${ts}&apikey=${apiKey}&hash=${hash}`;

    const response = await axios.get(`${comicReq}`);
    res.json(response.data);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
