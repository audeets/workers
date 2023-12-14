'use strict';

/**
 * Module dependencies.
 */

const log = require('./../logger');
const config = require('config');
const mongoose = require('mongoose');
const Result = require('./../../models/Results');

// End of dependencies.

const mongoConfig = config.get('mongo');
module.exports.process = function process(task, ackCallback) {
  mongoose.connect(mongoConfig.connect)
    .then(
      new Result(task)
        .save()
        .then(res => {
          return ackCallback();
        }, err => {
          return log.error(err);
        }))
    .catch(e => log.error(e));
};
