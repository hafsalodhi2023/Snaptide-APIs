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
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email,
            avatar: { url: profile.photos[0]?.value },
            provider: "google",
            isVerified: true,
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          // Link googleId if user existed by email
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
