const useragent = require("useragent");
const debug = require("debug")("server:utils:findLocation.util.js");

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  let ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress;

  // normalize ipv6 localhost
  if (ip === "::1") ip = "127.0.0.1";
  if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

  return ip;
}

module.exports = async (req) => {
  const ip = getClientIp(req);

  // Parse User-Agent
  const ua = useragent.parse(req.headers["user-agent"] || "Unknown");
  const deviceString = `${ua.family || "Unknown"} ${ua.major || ""} on ${
    ua.os.family || "Unknown"
  } ${ua.os.major || ""}`.trim();

  // Location lookup
  let locationString = "Unknown location";
  try {
    if (ip !== "127.0.0.1") {
      const response = await fetch(`https://ipapi.co/${ip}/json/`); // built-in fetch in Node 18+
      const data = await response.json();
      if (data.city && data.country_name) {
        locationString = `${data.city}, ${data.country_name}`;
      }
    }
  } catch (err) {
    debug("Geo lookup failed:", err.message);
  }

  debug(`New login from ${deviceString} in ${locationString}`);
  return { ip, device: deviceString, location: locationString };
};
