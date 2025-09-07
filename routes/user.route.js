const express = require("express");

// Importing controllers
const profile = require("../controllers/users/get-profile.controller");

// Importing middlewares
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/get-profile", authenticate, profile);

module.exports = router;
