import log from "./../logger.js";
import mongoose from "@benoitquette/audeets-api-commons/models/index.js";

const Result = mongoose.model("Result");

function process(env, task, ackCallback) {
  new Result(task)
    .save()
    .then((res) => {
      return ackCallback();
    })
    .catch((e) => log.error("Saving document", e));
}

export { process };
