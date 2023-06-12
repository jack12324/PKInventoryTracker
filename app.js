const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./utils/config");
const usersRouter = require("./routers/users");
const middleware = require("./utils/middleware");

const app = express();

mongoose.set("strictQuery", false);
logger.info("Connecting to MongoDB");
try {
  await mongoose.connect(config.MONGODB_URI);
  logger.info("Connection to MongoDB established");
} catch (error) {
  logger.error(`Connection to MongoDB failed with error: "${error}"`);
}

express.use(express.json());
express.use("api/users", usersRouter);

express.use(middleware.unknownEndpoint);

module.exports = app;
