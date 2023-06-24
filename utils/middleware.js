const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

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
    } else if (err.message.includes("Path `name` is required")) {
      res.status(400).send({ error: "name is required" });
    } else if (err.message.includes("Path `cabinet` is required")) {
      res.status(400).send({ error: "cabinet is required" });
    } else if (err.message.includes("Path `position` is required")) {
      res.status(400).send({ error: "position is required" });
    } else {
      logger.error(`Unhandled Validation Error: ${err.message}`);
      res.status(400).send({ error: err.message });
    }
  } else if (err.name === "JsonWebTokenError") {
    if (err.message.includes("jwt malformed")) {
      res.status(400).send({ error: "malformed token" });
    } else {
      logger.error(`Unhandled JsonWebToken Error: ${err.message}`);
      res.status(400).send({ error: err.message });
    }
  } else if (err.name === "CastError") {
    if (err.message.includes('at path "position"')) {
      res.status(400).send({ error: "position must be a number" });
    } else if (
      err.message.includes("Cast to ObjectId") &&
      err.message.includes("Cabinet")
    ) {
      res
        .status(404)
        .send({ error: "provided objectId for cabinet doesn't exist" });
    } else if (
      err.message.includes("Cast to ObjectId") &&
      err.message.includes("Drawer")
    ) {
      res
        .status(404)
        .send({ error: "provided objectId for drawer doesn't exist" });
    } else {
      logger.error(`Unhandled Cast Error: ${err.message}`);
      res.status(400).send({ error: err.message });
    }
  } else {
    logger.error(`Unhandled Error: ${err}`);
    res.status(500).send({ error: err });
  }
  next(err);
};

const extractToken = (req) => {
  const auth = req.get("Authorization");
  if (auth && auth.includes("Bearer ")) {
    return auth.replace("Bearer ", "");
  }
  return null;
};

const userExtractor = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    res.status(400).send({ error: "authorization token missing from request" });
    return;
  }

  const tokenUser = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(tokenUser.id);

  if (!user) {
    res.status(401).send({ error: "user for provided token doesn't exist" });
    return;
  }
  req.user = user;
  next();
};

const requireAdmin = async (req, res, next) => {
  const { user } = req;
  if (!user.admin) {
    res.status(401).send({ error: `user: ${user.userName} is not an admin` });
    return;
  }
  next();
};

module.exports = { unknownEndpoint, errorHandler, userExtractor, requireAdmin };
