const sharp = require("sharp");
const imagekit = require("../../config/imagekit.config");
const User = require("../../models/user.model");

const debug = require("debug")(
  "server:controllers:uploads:profile-upload.controller"
);

// Controller for profile image upload
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Compress + resize using sharp
    const processedBuffer = await sharp(req.file.buffer)
      .resize(256, 256, { fit: "cover" })
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    const fileBase64 = `data:image/webp;base64,${processedBuffer.toString(
      "base64"
    )}`;

    // Upload to ImageKit
    const uploadResult = await imagekit.upload({
      file: fileBase64,
      fileName: `avatar_${req.params.userId}_${Date.now()}.webp`,
      folder: "/snaptide/avatars",
      useUniqueFileName: true,
    });

    // Update user document (without upsert)
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        avatar: {
          url: uploadResult.url,
          fileId: uploadResult.fileId,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Avatar uploaded successfully", avatar: user.avatar });
  } catch (err) {
    debug(err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
};

module.exports = uploadProfileImage;
