"use strict";
const express = require("express");
const Movies_ctrl = require("../controllers/Movies_ctrl");
const router = express.Router();

router.get("/", Movies_ctrl.getAll);
router.get("/popular", Movies_ctrl.getPopular);
router.get("/:tmdbId", Movies_ctrl.getDetail);
router.post("/ai", Movies_ctrl.getAi);

module.exports = router;
