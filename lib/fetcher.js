import log from "./logger.js";
import { create } from "phantom";

/**
 * Fetches the rendered HTML content of the given URL.
 *
 * @param {string} url the url of the page to fetch the content of
 * @param {function} callback returns the HTML content
 * @return {*} nothing really...
 */
function fetch(url, callback) {
  // TODO add redis support
  log.debug(`Fetching url ${url}`);
  let phantomInstance;
  let phantomPage;
  return create()
    .then(
      (ph) => {
        phantomInstance = ph;
        return phantomInstance.createPage();
      },
      (err) => callback(err)
    )
    .then(
      (page) => {
        phantomPage = page;
        return phantomPage.open(url);
      },
      (err) => callback(err)
    )
    .then(
      (status) => {
        if (status === "fail") {
          callback(`could not fetch the page ${url}`);
        }
        return phantomPage.property("content");
      },
      (err) => callback(err)
    )
    .then(
      (content) => {
        callback(null, content);
        phantomPage.close();
        phantomInstance.exit();
      },
      (err) => callback(err)
    );
}

export default {
  fetch,
};
