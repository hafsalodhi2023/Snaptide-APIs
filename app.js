require("dotenv").config();

const express = require("express");
const cors = require("cors");
const debug = require("debug")("server:app.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(PORT, () => {
  debug(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
