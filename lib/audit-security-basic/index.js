import utilities from "../utilities.js";

/**
 * Process the given task by getting the content of the given URL
 * and checks it for basic security ruling.
 *
 * @param {Object} env the env from the parent process
 * @param {Object} task the details of the task to process
 * @param {function} ackCallback to callback once the audit is over. Important
 * to ack the message.
 */
function process(env, task, ackCallback) {
  const res = utilities.generateAuditResults(task, [
    {
      rule: "security-test-1",
      title: "Fake security rule test 1",
      check: false,
      source: "internal",
    },
    {
      rule: "security-test-2",
      title: "Fake security rule test 2",
      check: true,
      source: "internal",
    },
    {
      rule: "security-test-3",
      title: "Fake security rule test 3",
      check: true,
      source: "internal",
    },
  ]);
  return ackCallback(null, res);
  ackCallback(nul);
}

export { process };
