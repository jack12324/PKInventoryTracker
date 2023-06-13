const logger = require("./logger");

const unknownEndpoint = async (req, res) => {
  res.status(404).send({ error: "Unknown Endpoint" });
};

const errorHandler = async (err, req, res, next) => {
  logger.error(err);

  if (err.contains("Path `userName` is required")) {
    res.status(400).send({ error: "userName is required" });
  } else if (err.contains("Path `passwordHash` is required")) {
    res.status(400).send({ error: "password is required" });
  } else {
    res.status(500).send({ error: err });
  }
  next(err);
};

module.exports = { unknownEndpoint, errorHandler };
