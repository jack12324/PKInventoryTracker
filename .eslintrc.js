module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    "jest/globals": true,
  },
  extends: ["airbnb-base", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["jest"],
  rules: {
    "import/no-extraneous-dependencies": "off",
    "no-underscore-dangle": "off",
  },
};
