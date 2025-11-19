"use strict";
const { Op } = require("sequelize");
const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

class Auth_ctrl {
  //* ─── Register ────────────────────────────────────────────────────────
  static async register(req, res, next) {
    try {
      const { username, email, password, adult } = req.body;
      await User.create({ username, email, password, adult });

      res
        .status(201)
        .json({ message: "User Created", user: { username, email } });
    } catch (error) {
      console.log("🚀 ~ Auth_ctrl ~ register ~ error:", error);
      next(error);
    }
  }

  //* ─── Login ───────────────────────────────────────────────────────────
  static async login(req, res, next) {
    try {
      const { emailOrUsername, password } = req.body;

      if (!emailOrUsername) {
        throw { status: 400, message: "Email or Username is required" };
      }

      if (!password) {
        throw { status: 400, message: "Password is required" };
      }

      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
        },
      });

      if (!user) {
        throw { status: 401, message: "Invalid email/username or password" };
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw { status: 401, message: "Invalid email/username or password" };
      }

      const access_token = createToken({ id: user.id });

      res.status(200).json({
        message: "Login Success",
        user: { id: user.id, username: user.username, email: user.email },
        access_token,
      });
    } catch (error) {
      console.log("🚀 ~ login ~ error:", error);
      next(error);
    }
  }

  //* ─── Google Login ────────────────────────────────────────────────────
  static async loginGoogle(req, res, next) {
    try {
      const { googleToken } = req.body;
      console.log("🚀 ~ Auth_ctrl ~ loginGoogle ~ req.body:", req.body);

      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience:
          "793591115286-vhlm035ql80pai5q5dhuh8v450jnc6cu.apps.googleusercontent.com",
      });
      const payload = ticket.getPayload();

      let user = await User.findOne({ where: { email: payload.email } });

      if (!user) {
        const password = Math.random().toString(36);
        user = await User.create({
          username: payload.name,
          email: payload.email,
          password,
        });
      }
      console.log("🚀 ~ Auth_ctrl ~ loginGoogle ~ user:", user);

      const access_token = createToken({ id: user.id });

      res.status(200).json({
        message: "Login Success",
        access_token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (error) {
      console.log("🚀 ~ Auth_ctrl ~ loginGoogle ~ error:", error);
      next(error);
    }
  }
}

module.exports = Auth_ctrl;
