'use strict';

/**
 * Module dependencies.
 */

const log = require('./../logger');
const config = require('config');
const mongoose = require('mongoose');

// End of dependencies.

const mongoConfig = config.get('mongo');
require('./../../models/Results');

module.exports.process = function process(task, ackCallback) {
  const db = mongoose.createConnection(mongoConfig.connect);
  // mongoose.Promise = require('bluebird');
  const Result = mongoose.model('Result', new mongoose.Schema({
    timestamp: Date,
    category: String,
    url: String,
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    rules: [{
      rule: String,
      title: String,
      check: Boolean,
      details: [{
        text: String,
        link: String
      }]
    }]
  }));
  new Result(task)
    .save()
    .then(res => {
      return ackCallback();
    }, err => {
      return log.error(err);
    });
  mongoose.connection.close();
};
