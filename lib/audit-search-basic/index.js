import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import utilities from '../utilities.js';
import log from './../logger.js';
import fetcher from './../fetcher.js';

const __dirname = new URL('.', import.meta.url).pathname;
const dir = path.join(__dirname, 'rules');
var rulesModules = [];
fs.readdirSync(dir).forEach(async (file) => {
  if (path.extname(file) === '.js') {
    const ruleModule = await import(path.join(dir, file));
    rulesModules.push(ruleModule);
  }
});

/**
 * Load all the rules from the disk and check the given
 * content file against them.
 *
 * @param {string} content the HTML content to audit
 * @return {Array} the results of the audit
 */
function _checkMarkup(content) {
  const $ = cheerio.load(content);
  const results = [];
  rulesModules.forEach((ruleModule) => {
    try {
      const rule = ruleModule.validate($);
      results.push(rule);
      log.debug(JSON.stringify(rule));
    } catch (e) {
      log.error('Loading search rule from disk', e);
    }
  });
  return results;
}

/**
 * Process the given task by getting the content of the given URL
 * and checks it for basic SEO ruling.
 *
 * @param {Object} env the env from the parent process
 * @param {Object} task the details of the task to process
 * @param {function} ackCallback to callback once the audit is over. Important
 * to ack the message.
 */
function process(env, task, ackCallback) {
  fetcher.fetch(task.url, (err, content) => {
    if (err) {
      return ackCallback(err);
    }
    // require('fs').writeFileSync('page.'+Date.now()+'.html', content);
    const rules = _checkMarkup(content);
    const results = utilities.generateAuditResults(task, rules);
    return ackCallback(null, results);
  });
}

export { process, _checkMarkup };
