const express = require("express");
const router = express.Router();
const { uploadSingleImage } = require("../middlewares/multer.middleware");
const userController = require("../controllers/user.controller");

// Upload profile avatar
router.post("/profile/:userId", uploadSingleImage("avatar"));

module.exports = router;
