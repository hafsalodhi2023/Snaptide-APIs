const sharp = require("sharp");
const imagekit = require("../../config/imagekit.config");
const User = require("../../models/user.model");

// Controller for profile image upload
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    // Compress + resize using sharp
    const processedBuffer = await sharp(req.file.buffer)
      .resize(512, 512, { fit: "cover" })
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

    // Update user document
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        avatar: {
          url: uploadResult.url,
          fileId: uploadResult.fileId,
        },
      },
      { new: true, upsert: true }
    );

    res.json({ msg: "Avatar uploaded successfully", avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Upload failed", error: err.msg });
  }
};

module.exports = uploadProfileImage;
