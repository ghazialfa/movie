"use strict";

const tmdbAPI = require("../helpers/axios");

class Genres_ctrl {
  //* ─── Get All ─────────────────────────────────────────────────────────
  static async getAll(req, res, next) {
    try {
      const { data } = await tmdbAPI.get("/genre/movie/list");
      // console.log("🚀 ~ Genres_ctrl ~ getAll ~ data:", data);
      res.status(200).json(data);
    } catch (error) {
      console.log("🚀 ~ Genres_ctrl ~ getAll ~ error:", error);
      next(error);
    }
  }

  //* ─── Get Movies By Genre ─────────────────────────────────────────────
  static async getMovies(req, res, next) {
    try {
      const { id } = req.params;
      const { page = 1 } = req.query;
      const { data } = await tmdbAPI.get("/discover/movie", {
        params: {
          page,
          with_genres: id,
        },
      });
      // console.log("🚀 ~ Genres_ctrl ~ getMovies ~ data:", data);
      res.status(200).json(data);
    } catch (error) {
      console.log("🚀 ~ Genres_ctrl ~ getMovies ~ error:", error);
      next(error);
    }
  }
}

module.exports = Genres_ctrl;
