import sinon from "sinon";
import fetcher from "../../lib/fetcher.js";
import connect from "connect";
import serveStatic from "serve-static";
import urlLib from "url";
import { expect } from "../chai.js";
import { URL } from "url";

const port = "9615";
const invalidURl = "sdsdsqdsqdsqd.html";
const staticFile = "www.google.com.html";
const timeout = 10000;
const pause = 4000;

describe("fetcher", function () {
  describe("#fetch()", function () {
    before(function () {
      const __dirname = new URL(".", import.meta.url).pathname;
      const app = connect();
      app.use(serveStatic(__dirname));
      app.use(function onerror(err, req, res, next) {
        console.log("Error in server " + err);
      });
      app.listen(port, () => {
        console.log("Server running...");
      });
    });
    it("should return an error for an invalid URL", function (done) {
      this.timeout(timeout);
      const url = urlLib.resolve("http://localhost:" + port, invalidURl);
      const spy = sinon.spy();
      fetcher.fetch(url, spy);
      setTimeout(() => {
        done();
        expect(spy.called).to.equal(true);
        expect(spy.args[0][0]).to.equal(null);
        expect(spy.args[0][1]).to.have.string("Cannot");
      }, pause);
    });
    it("should return a static content", function (done) {
      this.timeout(timeout);
      const url = urlLib.resolve("http://localhost:" + port, staticFile);
      const spy = sinon.spy();
      fetcher.fetch(url, spy);
      setTimeout(() => {
        expect(spy.called).to.equal(true);
        expect(spy.args[0][0]).to.equal(null);
        expect(spy.args[0][1]).to.have.string("google.load");
        done();
      }, pause);
    });
  });
});
