import RabbitSchema from "rabbitmq-schema";
import _ from "lodash";
import rabbitConfig from "./rabbitmq.config.json" with { type: "json" };

const schema = new RabbitSchema(rabbitConfig);

/**
 * Extracts the bindings of a queue
 *
 * @param {string} queueName the name of the queue or the exchange
 * @param {function} callback returns the exchange, the queue and the routing
 * key
 * @return {*} nothing
 */
function getQueueBinding(queueName, callback) {
  if (
    _.every(schema.getBindings(), (binding) => {
      if (binding.destination.queue === queueName) {
        callback(
          null,
          binding.source,
          binding.destination,
          binding.routingPattern
        );
        return false;
      }
      return true;
    })
  )
    callback(`No queue defined with the name '${queueName}'`);
}

/**
 * @param {string} exchangeName the name of the exchange
 * @return {Object} the exchange schema - contains the name of the exchange,
 * the type and the options object
 */
function getExchange(exchangeName) {
  return schema.getExchangeByName(exchangeName);
}

export default {
  getQueueBinding,
  getExchange,
};
