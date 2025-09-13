const passport = require("passport");

// Importing utilities
const { signAccessToken, signRefreshToken } = require("../../utils/token.util");
const { setRefreshCookie } = require("../../utils/refreshCookie.util");
const findLocation = require("../../utils/findLocation.util");

const debug = require("debug")("server:controllers:auths:login.controller.js");

const login = (req, res, next) => {
  try {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ msg: "Auth error" });
      }

      if (!user) {
        return res.status(401).json({
          msg: info?.msg || "Invalid credentials",
        });
      }

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);

      setRefreshCookie(res, refreshToken);

      findLocation(req, res);

      return res.json({
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    })(req, res, next);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = login;
