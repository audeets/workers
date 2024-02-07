import log from "./../lib/logger.js";
import commander from "commander";
import { createWorker } from "./../lib/workers-commons/workers.js";
import version from "../package.json" assert { type: "json" };
// const pjson = require("../package.json");

commander.version(version);

commander
  .command("start <name>")
  .description("Starts the queue identified by the given name")
  .action((name) => {
    createWorker(process.env.URL_AMQP, name, (err) => {
      log.error(err);
    });
  });

commander.parse(process.argv);
