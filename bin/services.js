import { Command } from 'commander';
import version from '../package.json' with { type: 'json' };
import log from './../lib/logger.js';
import { createWorker } from './../lib/workers-commons/workers.js';

const program = new Command();

program.version(version);

program
  .command('start <name>')
  .description('Starts the queue identified by the given name')
  .action((name) => {
    createWorker(process.env.URL_AMQP, name, (err) => {
      log.error('From worker process', err);
    });
  });

program.parse(process.argv);
