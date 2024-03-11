import fs from 'fs';
import puppeteer from 'puppeteer';
import log from './logger.js';

const getChromeTempDataDir = (browser) => {
  // find chrome user data dir (puppeteer_dev_profile-XXXXX) to delete it after it had been used
  return browser
    .process()
    .spawnargs.reduce(
      (dir, arg) =>
        arg.startsWith('--user-data-dir=') ? arg.replace('--user-data-dir=', '') : dir,
      null
    );
};

/**
 * Fetches the rendered HTML content of the given URL.
 *
 * @param {string} url the url of the page to fetch the content of
 * @param {function} callback returns the HTML content
 * @return {*} nothing really...
 */
async function fetch(url, callback) {
  try {
    const confString = process.env.PUPPETEER_CONFIG;
    const conf = { ...(!!confString && JSON.parse(confString)) };
    log.debug(`Fetching url ${url} with config '${conf}'`);
    const browser = await puppeteer.launch(conf);
    const page = await browser.newPage();
    await page.goto(url);
    let source = await page.content({ waitUntil: 'domcontentloaded' });
    browser.close();
    callback(null, source);
    const tempDir = getChromeTempDataDir(browser);
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {
    process.exitCode = 1;
    log.error(e);
    callback(e);
  }
}

export default { fetch };
