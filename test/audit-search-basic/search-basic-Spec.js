/* eslint-disable import/no-named-as-default-member */
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import esmock from 'esmock';
import { expect } from '../chai.js';
import utilities from '../../lib/utilities.js';

const __dirname = new URL('.', import.meta.url).pathname;
const validUrl = 'url1';
const invalidUrl = 'url2';
const searchBasic = await esmock('../../lib/audit-search-basic/index.js', {
  '../../lib/fetcher.js': {
    fetch: (url, callback) => {
      switch (url) {
        case validUrl:
          callback(null, '<html/>');
          break;
        case invalidUrl:
          callback('invalid url');
          break;
        default:
          console.log(url);
      }
    }
  }
});

describe('search-basic', function () {
  describe('#process()', function () {
    it('should error if invalid URL', function () {
      const spy = sinon.spy();
      searchBasic.process(null, { url: invalidUrl }, spy);
      expect(spy.called).to.equal(true);
      expect(spy.args[0][0]).to.not.equal(null);
    });
    it('should send the results via the callback if valid URL', function () {
      const spy = sinon.spy();
      searchBasic.process(null, { url: validUrl }, spy);
      expect(spy.called).to.equal(true);
      expect(spy.args[0][0]).to.equal(null);
      expect(spy.args[0][1]).to.not.equal(null);
      expect(spy.args[0][1]).to.not.be.undefined;
    });
  });
  describe('#checkMarkup()', function () {
    it('should detect h1 tag', async function () {
      var content = '<html><body><h1>this is a h1 title</h1></body></html>';
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results)
        .to.be.an('array')
        .that.contains.something.like({ rule: 'include-h1', check: true });
    });
    it('should detect missing h1 tag', function () {
      var content = '<html><body></body></html>';
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results)
        .to.be.an('array')
        .that.contains.something.like({ rule: 'include-h1', check: false });
    });
    it('should detect the page title', function () {
      var content = '<html><head><title>this is the page title</title></head><body></body></html>';
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results).to.be.an('array').that.contains.something.like({
        rule: 'include-page-title',
        check: true
      });
    });
    it('should detect a missing page title', function () {
      var content = '<html><head></head><body></body></html>';
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results).to.be.an('array').that.contains.something.like({
        rule: 'include-page-title',
        check: false
      });
    });
    it('should detect a page title longer than 65 chars', function () {
      var content =
        '<html><head><title>this is a page title that is more than 65 chars. this is a page title that is more than 65 chars</title></head><body></body></html>';
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results).to.be.an('array').that.contains.something.like({
        rule: 'page-title-length',
        check: false
      });
    });
    it('should not detect a page title shorter than 65 chars', function () {
      var content =
        '<html><head><title>this is a page title that is shorter than 65 chars</title></head><body></body></html>';
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results).to.be.an('array').that.contains.something.like({
        rule: 'page-title-length',
        check: true
      });
    });
    it('should detect a missing meta description', function () {
      var content = '<html><head></head><body></body></html>';
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results).to.be.an('array').that.contains.something.like({
        rule: 'include-meta-description',
        check: false
      });
    });
    it('should recognize a meta description', function () {
      var content =
        "<html><head><meta name='description' content='this is a meta description'/></head><body></body></html>";
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results).to.be.an('array').that.contains.something.like({
        rule: 'include-meta-description',
        check: true
      });
    });
    it('should detect a meta description is longer than 150 chars', function () {
      var content =
        "<html><head><meta name='description' content='this is a meta description. this is a meta description. this is a meta description. this is a meta description. this is a meta description. this is a meta description. '/></head><body></body></html>";
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results).to.be.an('array').that.contains.something.like({
        rule: 'meta-description-length',
        check: false
      });
    });
    it('should not detect a meta description id shorter than 150 chars', function () {
      var content =
        "<html><head><meta name='description' content='this is a meta description'/></head><body></body></html>";
      var results = searchBasic._checkMarkup(content);
      expect(results).to.exist;
      expect(results).to.not.be.undefined;
      expect(results).to.not.be.empty;
      expect(results).to.be.an('array').that.contains.something.like({
        rule: 'meta-description-length',
        check: true
      });
    });
    it('should parse the static homepage of Le Monde and return the adequat rules', function () {
      var content = fs.readFileSync(path.join(__dirname, 'www.lemonde.fr.html'));
      var results = searchBasic._checkMarkup(content);
      console.info(results);
      utilities
        .loadJsonFileFromCwd('test/audit-search-basic/www.lemonde.fr.json')
        .forEach((rule) => {
          results.should.include.something.that.deep.equals(rule);
        });
    });
    it('should parse the static homepage of Google and return the adequat rules', function () {
      var content = fs.readFileSync(path.join(__dirname, 'www.google.com.html'));
      var results = searchBasic._checkMarkup(content);
      console.info(results);
      utilities
        .loadJsonFileFromCwd('test/audit-search-basic/www.google.com.json')
        .forEach((rule) => {
          results.should.include.something.that.deep.equals(rule);
        });
    });
  });
});
