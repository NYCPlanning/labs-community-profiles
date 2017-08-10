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
    'func-names': 0,
    'no-underscore-dangle': 0,
    'prefer-rest-params': 0,
    'prefer-arrow-callback': 0,
  },
  globals: {
   $: true,
   d3: true,
  }
};
