const { verifyAccessToken } = require("../utils/token.util");
const debug = require("debug")("server:middlewares:auth.middleware.js");

const auth = async (req, res, next) => {
  let token;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    try {
      token = req.headers["authorization"].split(" ")[1];
      const payload = verifyAccessToken(token);

      req.user = { id: payload.id };

      if (!req.user) {
        return res.status(401).json({
          msg: "Not authorized, user not found",
        });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({
        msg: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      msg: "Not authorized, no token",
    });
  }
};

module.exports = auth;
