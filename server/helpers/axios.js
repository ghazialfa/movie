"use strict";
const axios = require("axios");

const tmdbAPI = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: "Bearer " + process.env.TMDB_API_KEY,
  },
});

module.exports = tmdbAPI;
