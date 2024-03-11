import mongoose from '@benoitquette/audeets-api-commons/models/index.js';
import log from './../logger.js';

const Result = mongoose.model('Result');

function process(env, task, ackCallback) {
  new Result(task)
    .save()
    .then(() => {
      return ackCallback();
    })
    .catch((e) => log.error('Saving document', e));
}

export { process };
