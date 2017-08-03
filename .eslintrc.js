module.exports = {
  parser: "babel-eslint",
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: "airbnb",
  env: {
    browser: true
  },
  rules: {
  },
  globals: {
   $: true
  }
};
