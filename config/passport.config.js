const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      session: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        return done(null, "ok");
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
