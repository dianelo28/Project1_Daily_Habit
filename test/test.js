var request = require('request'),
	expect = require ('chai').expect;


describe ('localhost:3000/profile', function() {
  it('/profile should return 200 status code', function(done) {
    request.get('http://localhost:3000/profile', function(err, res, body) {
      expect(res.statusCode).to.equal(200)
      // expect(res.statusCode).to.equal(300)
      done();
    })
  })
});

describe ('localhost:3000/api/users/current', function() {
  it('/api/users/current should return 200 status code', function(done) {
    request.get('http://localhost:3000/api/users/current', function(err, res, body) {
      expect(res.statusCode).to.equal(200)
      // expect(res.statusCode).to.equal(300)
      done();
    })
  })
});

describe ('localhost:3000/api/goals', function() {
  it('/api/goals should return 200 status code', function(done) {
    request.get('http://localhost:3000/api/goals', function(err, res, body) {
      expect(res.statusCode).to.equal(200)
      // expect(res.statusCode).to.equal(300)
      done();
    })
  })
});

describe ('localhost:3000/api/goals/:id', function() {
  it('/api/goals.:id should return 200 status code', function(done) {
    request.get('http://localhost:3000/api/goals/55ae71793aeb9013434cb932', function(err, res, body) {
      expect(res.statusCode).to.equal(200)
      // expect(res.statusCode).to.equal(300)
      done();
    })
  })
});

describe ('localhost:3000/api/goals/', function() {
  it('/api/goals/ should return 200 status code', function(done) {
    request.post('/api/goals', function(err, res, body) {
      expect(res.statusCode).to.equal(200)
      // expect(res.statusCode).to.equal(300)
      done();
    })
  })
});

