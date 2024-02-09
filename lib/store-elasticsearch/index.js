import log from "./../logger.js";
import _ from "lodash";
import { resolve } from "url";

const INDEX_NAME = "audits";

function process(env, task, ackCallback) {
  const baseUrl = env.URL_ELASTIC_SEARCH;
  const indexUrl = resolve(baseUrl, INDEX_NAME);
  const resultsUrl = resolve(baseUrl, INDEX_NAME + "/_doc");

  // first, let's check if the index exists
  fetch(indexUrl, { method: "HEAD" }).then((checkRes) => {
    // if not, we create it
    if (checkRes.status === 404) {
      fetch(indexUrl, { method: "PUT" }).then((createRes) => {
        if (createRes.status !== 200) {
          error("Cannot create index", createRes);
        }
      });
    }

    // we flatten the results and create one doc per rule
    const resultRoot = _(task).omit("rules");
    _(task.rules).each((rule) => {
      const result = _(resultRoot).assign(rule);
      log.debug("sending document:" + JSON.stringify(result));
      // now we can add the document to the index
      fetch(resultsUrl, {
        method: "POST",
        body: JSON.stringify(result),
        headers: new Headers({ "Content-Type": "application/json" }),
      }).then((addResponse) => {
        if (addResponse.status !== 201) {
          return error("Cannot add document", addResponse);
        }
        return ackCallback();
      });
    });
  });
}

/**
 * Formats an HTTP error onto the error log
 *
 * @param {string} msg the custom error message
 * @param {Object} res the HTTP response the error originated from.
 * @return {*} nothing
 */
function error(msg, res) {
  return res.json().then((json) => {
    log.error(`${msg}: ${JSON.stringify(json, 2)}`);
  });
}

export { process };
