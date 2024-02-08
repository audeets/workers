import Ajv from "ajv";
import fs from "fs";
import path from "path";

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
 *
 * @param {Object} json the object to validate
 * @param {string} schemaPath the path to the schema file on the disk
 * @param {function} callback called on success and on errors
 * @return {*} nothing really...
 */
function validateJson(json, schemaPath, callback) {
  if (!validator.getSchema(schemaPath)) {
    const schema = loadJsonFile(schemaPath);
    validator.addSchema(schema, schemaPath);
  }
  if (!validator.validate(schemaPath, json)) {
    return callback(validator.errors);
  }
  return callback();
}

const loadJsonFileFromCwd = (filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  return loadJsonFile(fullPath);
};

const loadJsonFile = (filePath) => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

export default {
  generateAuditResults,
  validateJson,
  loadJsonFileFromCwd,
  loadJsonFile,
};
