"use strict";
var should = require('chai').should();
var httpRequest = require('request');
var sinon = require('sinon').sandbox.create();
var conf = require('./../testutil/configureForTest');
var groupsAPI = conf.get('beans').get('groupsAPI');

var base_uri = "http://localhost:" + parseInt(conf.get('port'), 10);

var app = require('../app.js');

describe('SWK Plattform server', function () {
  beforeEach(function (done) {
    sinon.stub(groupsAPI, 'getAllAvailableGroups', function (callback) {return callback(null, []); });
    app.start(done);
  });

  afterEach(function (done) {
    sinon.restore();
    app.stop(done);
  });

  it('responds on a GET for the home page', function (done) {
    httpRequest({uri: base_uri}, function (req, resp) {
      should.exist(resp);
      resp.statusCode.should.equal(200);
      done(); // without error check
    });
  });

  it('responds with HTML on a GET for the home page', function (done) {
    httpRequest({uri: base_uri}, function (req, resp) {
      resp.headers['content-type'].should.contain('text/html');
      done(); // without error check
    });
  });

  it('shows "Softwerkskammer" on the home page', function (done) {
    httpRequest({uri: base_uri}, function (req, resp) {
      resp.body.should.contain('Softwerkskammer');
      done(); // without error check
    });
  });

  it('provides the screen style sheet', function (done) {
    var stylesheet_uri = base_uri + '/stylesheets/screen.css';
    httpRequest({uri: stylesheet_uri}, function (req, resp) {
      resp.statusCode.should.equal(200);
      resp.headers['content-type'].should.contain('text/css');
      resp.body.should.contain('color:');
      done(); // without error check
    });
  });

  it('provides the clientside membercheck functions', function (done) {
    var stylesheet_uri = base_uri + '/clientscripts/check-memberform.js';
    httpRequest({uri: stylesheet_uri}, function (req, resp) {
      resp.statusCode.should.equal(200);
      resp.headers['content-type'].should.contain('application/javascript');
      resp.body.should.contain('#memberform');
      done(); // without error check
    });
  });
});
