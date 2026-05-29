//This file is for handling router and middlewares
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  "/courses/covers",
  express.static(path.join(__dirname, "public", "courses", "covers")),
);
app.use("/auth", authRouter);

module.exports = app;
