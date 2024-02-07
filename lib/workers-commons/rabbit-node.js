import { info, debug } from "./../logger";
import { connect } from "amqplib/callback_api";
import config from "./rabbit-config";

/**
 * Connect to a rabbitmq node and create a channel
 * @param {string} nodeUrl - the URL to the rabbitmq node
 * @param {function} callback - the callback that handles the response
 */
function _connect(nodeUrl, callback) {
  connect(nodeUrl, (err, connection) => {
    if (err) {
      return callback(err);
    }
    return connection.createChannel((err2, channel) => {
      if (err2) {
        return callback(err2);
      }
      return callback(null, channel);
    });
  });
}

/**
 * Connects to the rabbitmq node and creates a message queue.
 *
 * @param {string} nodeUrl - the URL to the rabbitmq node
 * @param {string} queueName - the name of the queue
 * @param {function} callback called when a message is published in the queue.
 * The channel is passed along to allow the caller to ack the message
 * @private
 */
function consume(nodeUrl, queueName, callback) {
  _connect(nodeUrl, (err, channel) => {
    if (err) {
      return callback(err);
    }
    return config.getQueueBinding(queueName, (err2, ex, queue, key) => {
      if (err2) {
        return callback(err2);
      }
      channel.assertExchange(ex.exchange, ex.type, ex.options);
      return channel.assertQueue(queueName, ex.exchange, (err3, q) => {
        if (err3) {
          return callback(err3);
        }
        info("Waiting for messages in queue '%s'", q.queue);
        channel.bindQueue(q.queue, ex.exchange, key);
        return channel.consume(
          q.queue,
          (message) => {
            debug("Received message in queue '%s'", q.queue);
            callback(null, channel, message);
          },
          queue.options
        );
      });
    });
  });
}

/**
 * Published a message to an exchange.
 *
 * @param {string} nodeUrl - the URL to the rabbitmq node
 * @param {string} exchangeName the name of the exchange to publish the message to
 * @param {string} routingKey the routing key - can be an empty string
 * @param {Object} message the message to pusblish
 * @param {function} callback to send back errors mainly
 */
function publish(nodeUrl, exchangeName, routingKey, message, callback) {
  debug("In publishing");
  debug(` publishing to exchange '${exchangeName}'`);
  debug(` publishing to route '${routingKey}'`);
  _connect(nodeUrl, (err, channel) => {
    if (err) {
      return callback(err);
    }
    const ex = config.getExchange(exchangeName);
    if (!ex) {
      return callback(`Unknown exchange '${exchangeName}'`);
    }
    channel.assertExchange(ex.exchange, ex.type, ex.options);
    const str = JSON.stringify(message, null, 2);
    info(` publishing message: ${str}`);
    channel.publish(ex.exchange, routingKey, Buffer.from(str));
    info(" published message");
    return setTimeout(() => {
      channel.connection.close();
    }, 500);
  });
  debug("Out publishing");
}

export default {
  consume,
  publish,
};
