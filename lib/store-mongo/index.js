'use strict';

/**
 * Module dependencies.
 */

const log = require('./../logger');
const mongoose = require('mongoose');
const Result = require('./../../models/Results');

// End of dependencies.

const mongoUrl = process.env.URL_MONGO;
module.exports.process = function process(env, task, ackCallback) {
  mongoose.connect(mongoUrl.connect)
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
