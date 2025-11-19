const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = authentication = async (req, res, next) => {
  try {
    const access_token = req.headers.authorization;

    if (!access_token || !access_token.startsWith("Bearer ")) {
      throw { name: "InvalidToken" };
    }

    const token = access_token.split(" ")[1];
    const payload = verifyToken(token);

    const user = await User.findByPk(payload.id);

    if (!user) {
      throw { name: "InvalidToken" };
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("🚀 ~ module.exports=authentication= ~ error:", error);
    next({ name: "Unaunthenticated" });
  }
};
