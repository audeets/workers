import { error } from "./../lib/logger";
import { version, command, parse } from "commander";
import { createWorker } from "./../lib/workers-commons/workers";
import { version as _version } from "../package.json";

const amqpUrl = process.env.URL_AMQP;

version(_version);

command("start <name>")
  .description("Starts the queue identified by the given name")
  .action((name) => {
    createWorker(amqpUrl, name, (err) => {
      error(err);
    });
  });

parse(process.argv);
