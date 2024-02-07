import { error } from "./../logger.js";
import { model, connect } from "@benoitquette/audeets-api-commons/models";

const Result = model("Result");

export function process(env, task, ackCallback) {
  const mongoUrl = env.URL_MONGO;
  connect(mongoUrl)
    .then(
      new Result(task).save().then(
        (res) => {
          return ackCallback();
        },
        (err) => {
          return error(err);
        }
      )
    )
    .catch((e) => error(e));
}
