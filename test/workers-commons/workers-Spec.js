/* eslint-disable import/no-named-as-default-member */
import path from 'path';
import sinon from 'sinon';
import esmock from 'esmock';
import { expect } from '../chai.js';

const queue1 = path.join('..', 'test', 'workers-commons', 'worker-queue1-mock');
const queue2 = path.join('..', 'test', 'workers-commons', 'worker-queue2-mock');
const exchange1 = { exchange: 'ex1' };
const channelMock = { ack: () => {} };
const workers = await esmock('../../lib/workers-commons/workers.js', {
  '../../lib/workers-commons/rabbit-node.js': {
    consume: function (nodeUrl, queueName, callback) {
      switch (queueName) {
        case queue1:
          return callback(null, channelMock, {
            content: JSON.stringify({
              url: 'ooooo',
              project: 'pppp'
            })
          });
        case queue2:
          return callback(null, channelMock, {
            content: JSON.stringify({
              url: 'ooooo'
            })
          });
        default:
      }
      return callback('unknown queue from mock', channelMock);
    },
    publish: function (nodeUrl, exchangeName, routingKey, message, callback) {
      console.log(exchangeName);
      switch (exchangeName) {
        case exchange1.exchange:
        case 'audit':
        case 'store':
          return;
        default:
      }
      return callback('unknown exchange: ' + exchangeName);
    }
  }
});

describe('workers', function () {
  describe('#createWorker()', function () {
    it('should return an error because of unknown queue', function () {
      const spy = sinon.spy();
      workers.createWorker('nodeurl', 'this is not the name of a queue', spy);
      expect(spy.called).to.equal(true);
      const error = spy.args[0][0];
      expect(error).to.not.equal(null);
      expect(error).to.have.string('unknown queue');
      console.log(error);
    });
    it('should return no error', function () {
      channelMock.ack = sinon.spy();
      const spy = sinon.spy();
      workers.createWorker('nodeurl', queue1, spy);
      expect(spy.called).to.equal(false);
      // expect(channelMock.ack.called).to.equal(true);
    });
    it('should return a validation error because of a bad task', function () {
      channelMock.ack = sinon.spy();
      const spy = sinon.spy();
      workers.createWorker('nodeurl', queue2, spy);
      expect(channelMock.ack.called).to.equal(true);
      expect(spy.called).to.equal(false);
    });
  });
  describe('#publishAuditTask()', function () {
    it('should endup gracefully', function () {
      const spy = sinon.spy();
      workers.publishAuditTask(
        'nodeurl',
        {
          url: 'url',
          project: 'projectid'
        },
        spy
      );
      expect(spy.called).to.equal(false);
    });
  });
});
