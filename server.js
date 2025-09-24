const app = require("./app");
const PORT = process.env.PORT || 3000;
const debug = require("debug")("server:server.js");

app.listen(PORT, () => {
  debug(`Server running on http://localhost:${PORT}`);
});
