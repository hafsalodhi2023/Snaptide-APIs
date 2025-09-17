const express = require("express");
const router = express.Router();
const { uploadSingleImage } = require("../middlewares/multer.middleware");
const uploadProfileImage = require("../controllers/uploads/profile-upload.controller");

// Upload profile avatar
router.put("/profile", uploadSingleImage("avatar"), uploadProfileImage);

module.exports = router;
