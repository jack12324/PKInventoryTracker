module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "import"],
  rules: {
    "react/jsx-filename-extension": "off",
    "react/react-in-jsx-scope": "off",
    "import/no-extraneous-dependencies": "off",
  },
};
