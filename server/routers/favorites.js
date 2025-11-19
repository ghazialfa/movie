"use strict";
const express = require("express");
const Favorite_ctrl = require("../controllers/Favorite_ctrl");
const router = express.Router();

router.get("/", Favorite_ctrl.getFavorites);
router.post("/:tmdbId", Favorite_ctrl.addFavorite);
router.delete("/:dbId", Favorite_ctrl.deleteFavorite);
router.patch("/:id", Favorite_ctrl.updateStatus);

module.exports = router;
