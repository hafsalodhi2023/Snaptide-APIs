const fetch = require("node-fetch");
const useragent = require("useragent");

global.fetch = require("node-fetch");

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress;
}

module.exports = async (req, res) => {
  const ip = getClientIp(req);

  // Parse UA
  const ua = useragent.parse(req.headers["user-agent"]);
  const deviceString = `${ua.family} ${ua.major} on ${ua.os.family} ${ua.os.major}`;

  // Location lookup
  let locationString = "Unknown location";
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    if (data.city && data.country_name) {
      locationString = `${data.city}, ${data.country_name}`;
    }
  } catch (err) {
    console.error("Geo lookup failed:", err.message);
  }
  console.log(`New login from ${deviceString} in ${locationString}`);
};
