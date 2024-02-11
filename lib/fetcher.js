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
  log.debug(`Fetching url ${url}`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  let source = await page.content({ waitUntil: "domcontentloaded" });
  browser.close();
  callback(null, source);
}

export default {
  fetch,
};
