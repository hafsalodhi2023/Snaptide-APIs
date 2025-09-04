const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const debug = require("debug")("server:config:passport.config.js");

const User = require("../models/user.model");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { msg: "User not found" });
        }

        const ok = await user.comparePassword(password);
        if (!ok) return done(null, false, { msg: "Invalid credentials" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = passport;
