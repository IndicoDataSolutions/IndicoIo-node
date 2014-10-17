var indico = require('..').local
  , data = require('./data.json')
  , should = require('chai').should();

describe('Image', function() {
  describe('fer', function() {
    it('should get the right response format', function(done) {
      indico.fer(data[0], function(err, res) {
		if (err) {
		  done(err);
		  return;
		}
	
		Object.keys(res).should.have.length(6);
		done();
      });
    });
    
    it('should get the right response format', function(done) {
      indico.fer(data[1], function(err, res) {
		if (err) {
		  done(err);
		  return;
		}
	
		Object.keys(res).should.have.length(6);
		done();
      });
    });
  });

  describe('facialfeatures', function() {
    it('should get the right response format', function(done) {
      indico.facialfeatures(data[0], function(err, res) {
		if (err) {
		  done(err);
		  return;
		}
	
		res.should.have.length(48);
		done();
      });
    });
  });

  describe('imagefeatures', function() {
    it('should get the right response format', function(done) {
      indico.imagefeatures(data[0], function(err, res) {
	    if (err) {
	      done(err);
	      return;
	    }

	    res.should.have.length(2048);
	    done();
	  });
	});
  });
});
