/* eslint-env node */
'use strict';

const path = require('path');

/* eslint-disable-next-line no-unused-vars */
module.exports = function(env) {
  return {
    clientAllowedKeys: ['ZAP_API_STAGING_URL', 'ZAP_API_PRODUCTION_URL'],
    fastbootAllowedKeys: [],
    failOnMissingKey: false,
    path: path.join(path.dirname(__dirname), '.env'),
  };
};
