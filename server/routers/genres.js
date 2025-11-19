"use strict";
const express = require("express");
const Genres_ctrl = require("../controllers/Genres_ctrl");
const router = express.Router();

router.get("/", Genres_ctrl.getAll);
router.get("/:id", Genres_ctrl.getMovies);

module.exports = router;
