const express = require("express");

// Importing controllers
const profile = require("../controllers/users/get-profile.controller");
const deleteProfile = require("../controllers/users/delete-profile.controller");

// Importing middlewares
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/get-profile", authenticate, profile);
router.delete("/delete-profile", deleteProfile);

module.exports = router;
