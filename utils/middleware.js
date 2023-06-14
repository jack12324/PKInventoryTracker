const logger = require("./logger");

const unknownEndpoint = async (req, res) => {
  res.status(404).send({ error: "Unknown Endpoint" });
};

const errorHandler = async (err, req, res, next) => {
  logger.info(`${err.name} ${err.message}`);

  if (err.name === "ValidationError") {
    if (err.message.includes("expected `userName` to be unique")) {
      res.status(400).send({ error: "username must be unique" });
    } else if (
      err.message.includes("userName") &&
      err.message.includes("is shorter than the minimum")
    ) {
      res.status(400).send({ error: "username must be at least 5 characters" });
    } else if (err.message.includes("Path `userName` is required")) {
      res.status(400).send({ error: "username is required" });
    } else {
      logger.error(`Unhandled Validation Error: ${err.message}`);
      res.status(400).send({ error: err.message });
    }
  } else {
    logger.error(`Unhandled Error: ${err}`);
    res.status(500).send({ error: err });
  }
  next(err);
};

module.exports = { unknownEndpoint, errorHandler };
