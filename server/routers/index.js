"use strict";
const express = require("express");
const Auth_ctrl = require("../controllers/Auth_ctrl");
const authentication = require("../middlewares/authentication");
const Movies_ctrl = require("../controllers/Movies_ctrl");
const router = express.Router();

router.post("/register", Auth_ctrl.register);
router.post("/login", Auth_ctrl.login);
router.post("/login/google", Auth_ctrl.loginGoogle);

router.get("/posters", Movies_ctrl.getPoster);

router.use(authentication);
router.use("/movies", require("./movies"));
router.use("/favorites", require("./favorites"));
router.use("/genres", require("./genres"));

module.exports = router;
