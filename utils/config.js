require("dotenv").config();

const { PORT } = process.env;

const getDB = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return process.env.MONGODB_URI;
    case "e2e":
      return process.env.MONGODB_URI_E2E;
    case "dev":
      return process.env.MONGODB_URI_DEV;
    default:
      return process.env.MONGODB_URI_TEST;
  }
};

const MONGODB_URI = getDB();

module.exports = {
  MONGODB_URI,
  PORT,
};
