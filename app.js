const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const logger = require("./utils/logger");
const config = require("./utils/config");
const usersRouter = require("./routers/users");
const cabinetsRouter = require("./routers/cabinets");
const drawersRouter = require("./routers/drawers");
const itemsRouter = require("./routers/items");
const loginRouter = require("./routers/login");
const middleware = require("./utils/middleware");

const app = express();

mongoose.set("strictQuery", false);
logger.info("Connecting to MongoDB");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connection to MongoDB established");
  })
  .catch((error) => {
    logger.error(`Connection to MongoDB failed with error: "${error}"`);
  });

app.use(express.static("build"));

app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);
app.use("/api/cabinets", middleware.userExtractor, cabinetsRouter);
app.use("/api/drawers", middleware.userExtractor, drawersRouter);
app.use("/api/items", middleware.userExtractor, itemsRouter);
app.use("/api/login", loginRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
