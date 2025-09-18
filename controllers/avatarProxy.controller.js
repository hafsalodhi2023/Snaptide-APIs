const avatarProxy = async (req, res) => {
  const imageUrl = req.query.url;

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch image from source");
    }

    const buffer = await response.arrayBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send("Image failed to load");
  }
};

module.exports = avatarProxy;
