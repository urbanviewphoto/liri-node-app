const search = require('../index');
const should = require('chai').should();
const expect = require('chai').expect;

describe('spotify search', function() {
	
	it('should not return an object', function(done) {
		search.should.not.be.a('string');
		done();
	});

	it('should have a property artists', function(done) {
		search('avicii', 'artist', function(err, body) {
			let response = JSON.parse(body);
			response.should.have.property('artists');
			done();
		});
	});
	
});
