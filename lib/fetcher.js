import log from "./logger.js";
import puppeteer from "puppeteer";

/**
 * Fetches the rendered HTML content of the given URL.
 *
 * @param {string} url the url of the page to fetch the content of
 * @param {function} callback returns the HTML content
 * @return {*} nothing really...
 */
async function fetch(url, callback) {
  const confString = process.env.PUPPETEER_CONFIG;
  log.debug(`Fetching url ${url} with config '${confString}'`);
  const browser =
    confString && confString.length > 0
      ? await puppeteer.launch(JSON.parse(confString))
      : await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  let source = await page.content({ waitUntil: "domcontentloaded" });
  browser.close();
  callback(null, source);
}

export default {
  fetch,
};
