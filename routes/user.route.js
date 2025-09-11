const express = require("express");

// Importing controllers
const profile = require("../controllers/users/get-profile.controller");
const deleteProfile = require("../controllers/users/delete-profile.controller");
const updateProfile = require("../controllers/users/update-profile.controller");

// Importing middlewares
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/get-profile", authenticate, profile);
router.delete("/delete-profile", authenticate, deleteProfile);
router.put("/update-profile", authenticate, updateProfile);

module.exports = router;
