'use strict';

/**
 * Module dependencies.
 */

const log = require('./../logger');
const mongoose = require('mongoose');
const Result = require('./../../models/Results');

// End of dependencies.

module.exports.process = function process(env, task, ackCallback) {
  const mongoUrl = env.URL_MONGO;
  mongoose.connect(mongoUrl)
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
