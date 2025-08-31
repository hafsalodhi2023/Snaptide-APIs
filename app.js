require("dotenv").config();

const express = require("express");
const cors = require("cors");
const debug = require("debug")("server:app.js");
const connectDB = require("./config/db.config");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  debug(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
