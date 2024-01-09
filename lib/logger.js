'use strict';

/**
 * Module dependencies.
 */
const winstonConfig = require('winston-config');
const winston = require('winston');
// const traverse = require('traverse');
// const os = require('os');

// End of dependencies.

const loggerConfig = {
  default: {
    console: {
      level: "debug",
      colorize: true,
      timestamp: true,
      label: "tbd"
    },
    file: {
      level: "debug",
      filename: "log/audits.log",
      timestamp: true,
      label: "tbd",
      json: false,
      maxsize: 500000,
      maxFiles: 10
    }
  }
};

// traverse(config).forEach(function conf() {
//   if (this.key === 'label') {
//     const host = os.hostname();
//     this.update(`@${host}`);
//   }
// });
winstonConfig.fromJson(loggerConfig, err => {
  if (err) throw err;
});

module.exports = winston.loggers.get('default');
