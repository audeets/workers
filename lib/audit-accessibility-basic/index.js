/**
 * Process the given task by getting the content of the given URL
 * and checks it for basic accessibility ruling.
 *
 * @param {Object} env the env from the parent process
 * @param {Object} task the details of the task to process
 * @param {function} ackCallback to callback once the audit is over. Important
 * to ack the message.
 */
function process(env, task, ackCallback) {
  ackCallback(null, [
    {
      rule: "accessibility-test-1",
      title: "Fake accessibility rule test 1",
      check: false,
      source: "internal",
    },
    {
      rule: "accessibility-test-2",
      title: "Fake accessibility rule test 2",
      check: true,
      source: "internal",
    },
  ]);
}

export { process };
