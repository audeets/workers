'use strict';

/**
 * Module dependencies.
 */

const log = require('./../logger');
const config = require('config');
const _ = require('lodash');
require('isomorphic-fetch');

// End of dependencies.

const esConfig = config.get('elasticsearch');

const INDEX_NAME = "audits";
const DOCUMENT_NAME = "result";
const root = esConfig.connect.url;
const indexUrl = `${root}/${INDEX_NAME}`;
const resultsUrl = `${indexUrl}/_doc`;

module.exports.process = function process(task, ackCallback) {
  // first, let's check if the index exists'
  fetch(indexUrl, {method: 'HEAD'})
    .then(checkRes => {
      // if not, we create it
      if (checkRes.status === 404) {
        fetch(indexUrl, {method: 'PUT'})
          .then(createRes => {
            if (createRes.status !== 200) {
              error('Cannot create index', createRes);
            }
          });
      }

      // we flatten the results and create one doc per rule
      const resultRoot = _(task).omit('rules');
      _(task.rules).each(rule => {
        const result = _(resultRoot).assign(rule);
        log.debug('sending document:' + JSON.stringify(result));
        // now we can add the document to the index
        fetch(`${resultsUrl}`, {
          method: 'POST',
          body: JSON.stringify(result),
          headers: new Headers({'Content-Type': 'application/json'})
        })
        .then(addResponse => {
          if (addResponse.status !== 201) {
            return error('Cannot add document', addResponse);
          }
          // return ackCallback();
        });
      });
    });
};

/**
 * Formats an HTTP error onto the error log
 * @param {string} msg the custom error message
 * @param {Object} res the HTTP response the error originated from.
 * @return {*} nothing
 */
function error(msg, res) {
  return res.json().then(json => {
    log.error(`${msg}: ${JSON.stringify(json, 2)}`);
  });
}
