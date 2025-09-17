const sharp = require("sharp");
const imagekit = require("../../config/imagekit.config");
const User = require("../../models/user.model");
const { verifyAccessToken } = require("../../utils/token.util");

const debug = require("debug")(
  "server:controllers:uploads:profile-upload.controller"
);

// Controller for profile image upload
const uploadProfileImage = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const decoded = verifyAccessToken(accessToken);
    const userId = decoded.id;

    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

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
      fileName: `avatar_${userId}_${Date.now()}.webp`,
      folder: "/snaptide/avatars",
      useUniqueFileName: true,
    });

    // Update user document (without upsert)
    const user = await User.findByIdAndUpdate(
      userId,
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

    res
      .status(200)
      .json({ msg: "Avatar uploaded successfully", avatar: user.avatar });
  } catch (err) {
    debug(err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
};

module.exports = uploadProfileImage;
