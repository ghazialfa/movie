const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const createToken = (payload) => {
  return jwt.sign(payload, secret);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    // console.log("🚀 ~ verifyToken ~ error:", error)
    return false;
  }
};

module.exports = { createToken, verifyToken };
