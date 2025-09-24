// Importing User and Otp models
const User = require("../../models/user.model");

const debug = require("debug")(
  "server:controllers:auths:register.controller.js"
);

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already in use" });

    const user = await User.create({ firstName, lastName, email, password });

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (e) {
    debug(e);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = register;
