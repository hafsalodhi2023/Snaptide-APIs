const { verifyAccessToken } = require("../utils/token.util");
const debug = require("debug")("server:middlewares:auth.middleware.js");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        msg: "Not authorized, no token",
      });
    }

    const payload = verifyAccessToken(token);

    req.user = { id: payload.id };

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Not authorized, token failed",
    });
  }
};

module.exports = auth;
