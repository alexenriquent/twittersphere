/** Module dependencies */
var app = require('../config/express');
var http = require('http');
var request = require('supertest');
var should = require('should');

/* Main route test cases */
describe('Main route', function() {

  /* Main route */
  describe('GET /', function() {
    it('should return 200', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.status.should.equal(200);
          done();
        });
    });

    it('should display content as "text/html"', function(done) {
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });
  });

  /* Default route */
  describe('GET /test', function() {
    it('should return 200', function(done) {
      request(app)
        .get('/test')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.status.should.equal(200);
          done();
        });
    });

    it('should display content as "text/html"', function(done) {
      request(app)
        .get('/test')
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });
  });
});