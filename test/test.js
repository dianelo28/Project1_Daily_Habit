var request = require('request'),
	expect = require ('chai').expect,
	baseUrl = 'http://localhost:3000'

describe('GET /', function() {
  it('should have a HTTP of 200 - success', function(done) {
    request(baseUrl, function(err, res, body) {
      expect(res.statusCode).to.equal(200)
      // expect(res.statusCode).to.equal(300)
      done();
    });
  });
});