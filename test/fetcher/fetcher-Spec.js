/* eslint-disable import/no-named-as-default-member */
import urlLib, { URL } from 'url';
import sinon from 'sinon';
import connect from 'connect';
import serveStatic from 'serve-static';
import fetcher from '../../lib/fetcher.js';
import { expect } from '../chai.js';

const port = '9615';
const invalidURl = 'sdsdsqdsqdsqd.html';
const staticFile = 'www.google.com.html';
const timeout = 10000;

describe('fetcher', function () {
  describe('#fetch()', function () {
    before(function () {
      console.log('here');
      const __dirname = new URL('.', import.meta.url).pathname;
      const app = connect();
      app.use(
        serveStatic(__dirname, {
          fallthrough: false
        })
      );
      app.use(function onerror(err) {
        console.error('Error in server: ' + err.statusMessage);
      });
      app.listen(port, () => {
        console.log('Server running...');
      });
    });
    it('should return an error for an invalid URL', async function () {
      this.timeout(timeout);
      const url = urlLib.resolve('http://localhost:' + port, invalidURl);
      const spy = sinon.spy();
      await fetcher.fetch(url, spy);
      expect(spy.called).to.equal(true);
      expect(spy.args[0][0]).to.equal(null);
      expect(spy.args[0][1]).to.have.string('ENOENT');
    });
    it('should return a static content', async function () {
      this.timeout(timeout);
      const url = urlLib.resolve('http://localhost:' + port, staticFile);
      const spy = sinon.spy();
      await fetcher.fetch(url, spy);
      expect(spy.called).to.equal(true);
      expect(spy.args[0][0]).to.equal(null);
      expect(spy.args[0][1]).to.have.string('google.load');
    });
  });
});
