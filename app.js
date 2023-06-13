const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const usersRouter = require("./routers/users");
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

app.use(express.json());
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
