"use strict";
const tmdbAPI = require("../helpers/axios");
const { Movie, Favorite } = require("../models");

class Favorite_ctrl {
  //* ─── Add Favorite ────────────────────────────────────────────────────
  static async addFavorite(req, res, next) {
    try {
      const { tmdbId } = req.params;
      const { id } = req.user;

      const movie = await Movie.findOrCreate({
        where: { tmdbId },
        default: { tmdbId },
      });

      const favorite = await Favorite.findOrCreate({
        where: { UserId: id, MovieId: movie[0].id },
        default: { UserId: id, MovieId: movie[0].id },
      });

      res.status(200).json(favorite[0]);
    } catch (error) {
      console.log("🚀 ~ Favorite_ctrl ~ addFavorite ~ error:", error);
      next(error);
    }
  }

  //* ─── Get Favorite ────────────────────────────────────────────────────
  static async getFavorites(req, res, next) {
    try {
      const { id } = req.user;

      const favorites = await Favorite.findAll({
        where: { UserId: id },
        include: Movie,
      });

      let movies = [];

      for (const favorite of favorites) {
        const { Movie } = favorite;
        const { data } = await tmdbAPI.get(`/movie/${Movie.tmdbId}`);
        movies.push({ dbId: Movie.id, data });
      }

      const output = movies.map(({ dbId, data }) => ({
        dbId,
        id: data.id,
        title: data.title,
        backdrop_path: data.backdrop_path,
        genres: data.genres,
        original_language: data.original_language,
        overview: data.overview,
        vote_count: data.vote_count,
        vote_average: data.vote_average,
        poster_path: data.poster_path,
        release_date: data.release_date,
        adult: data.adult,
      }));

      res.status(200).json(output);
    } catch (error) {
      console.log("🚀 ~ Favorite_ctrl ~ getFavorite ~ error:", error);
      next(error);
    }
  }

  //* ─── Delete Favorite ─────────────────────────────────────────────────
  static async deleteFavorite(req, res, next) {
    try {
      const { dbId } = req.params;
      console.log("🚀 ~ Favorite_ctrl ~ deleteFavorite ~ dbId:", dbId);
      const { id: userId } = req.user;
      console.log("🚀 ~ Favorite_ctrl ~ deleteFavorite ~ userId:", userId);

      const favorite = await Favorite.findOne({
        where: { UserId: userId, MovieId: dbId },
      });

      if (!favorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      await favorite.destroy();

      res.status(200).json({ message: "Successfully deleted favorite" });
    } catch (error) {
      console.log("🚀 ~ Favorite_ctrl ~ deleteFavorite ~ error:", error);
      next(error);
    }
  }

  //* ─── Update Status Favorite ──────────────────────────────────────────
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const { status } = req.body;
      console.log("🚀 ~ Favorite_ctrl ~ updateStatus ~ status:", status);

      const favorite = await Favorite.findOne({
        where: { UserId: userId, MovieId: id },
      });

      const favoriteUpdate = await favorite.update({ status });

      res.status(200).json(favoriteUpdate);
    } catch (error) {
      console.log("🚀 ~ Favorite_ctrl ~ updateStatus ~ error:", error);
      next(error);
    }
  }
}

module.exports = Favorite_ctrl;
