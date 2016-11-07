'use strict';

/**
 * Module dependencies.
 */
const winstonConfig = require('winston-config');
const winston = require('winston');
const traverse = require('traverse');
const os = require('os');
const config = require('config');

// End of dependencies.

const loggerConfig = config.get('logging');

traverse(config).forEach(function conf() {
  if (this.key === 'label') {
    const host = os.hostname();
    this.update(`@${host}`);
  }
});
winstonConfig.fromJson(loggerConfig, err => {
  if (err) throw err;
});

module.exports = winston.loggers.get('default');
