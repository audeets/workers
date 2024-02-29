import log from "./../logger.js";
import { resolve } from "url";

const INDEX_NAME = "audits";

function process(env, task, ackCallback) {
  const baseUrl = env.URL_ELASTIC_SEARCH;
  const resultsUrl = resolve(baseUrl, INDEX_NAME + "/_doc");

  const resultRoot = { ...task };
  delete resultRoot.rules;
  // we flatten the results and create one doc per rule
  task.rules.forEach((rule) => {
    const result = { ...resultRoot, ...rule };
    // now we can add the document to the index
    fetch(resultsUrl, {
      method: "POST",
      body: JSON.stringify(result),
      headers: new Headers({ "Content-Type": "application/json" }),
    }).then((addResponse) => {
      if (addResponse.status !== 201) {
        log.error(addResponse);
      }
    });
  });
  return ackCallback();
}

export { process };
