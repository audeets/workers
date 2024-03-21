import mongoose from '@audeets/api-commons/models/index.js';
import log from './../lib/logger.js';
import { process as processResult } from './../lib/store-elasticsearch/index.js';

mongoose
  .model('Result')
  .find()
  .then((results) => {
    results.forEach((result) => {
      const resultCopy = {
        timestamp: result.timestamp,
        category: result.category,
        url: result.url,
        project: result.project,
        rules: result.rules.map((r) => ({
          rule: r.rule,
          title: r.title,
          check: r.check,
          details: r.details
        }))
      };
      processResult(process.env, resultCopy, (err) => {
        if (err) log.error(err);
      });
    });
  })
  .catch((error) => {
    log.error(error);
  });
