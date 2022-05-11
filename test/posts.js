// test/posts.js
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const { describe, it } = require('mocha');
const app = require('../app.js');
const agent = chai.request(app);
const should = chai.should();

describe('Posts', function () {
  // Post that we'll use for testing purposes
  const newPost = {
    title: 'post title',
    summary: 'post summary'
  };
  it('should create with valid attributes at POST /posts/new', function (done) {
    return done();
  });
});

module.exports = app;
