import Ajv from "ajv";

const validator = new Ajv();

/**
 * Generates the structure of audit results.
 * @param {Object} task the origin task that triggered the audit
 * @param {Object} rules the results of the audit
 * @return {{collection: *, document: {timestamp: Date, url: *, project: *,
 * rules: *}}} the skeleton of an audit structure
 */
function generateAuditResults(task, rules) {
  return {
    category: "",
    timestamp: new Date(),
    url: task.url,
    project: task.project,
    rules,
  };
}

/**
 * Validate a json object according to a json schema.
 * @param {Object} json the object to validate
 * @param {string} schemaPath the path to the schema file on the disk
 * @param {function} callback called on success and on errors
 * @return {*} nothing really...
 */
function validateJson(json, schemaPath, callback) {
  if (!validator.getSchema(schemaPath)) {
    const schema = require(schemaPath); // eslint-disable-line
    validator.addSchema(schema, schemaPath);
  }
  if (!validator.validate(schemaPath, json)) {
    return callback(validator.errors);
  }
  return callback();
}

export { generateAuditResults, validateJson };
