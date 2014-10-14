var indico = require('..')
  , data = require('./data.json');

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

  describe('facialFeatures', function() {
    it('should get the right response format', function(done) {
      indico.facialFeatures(data[0], function(err, res) {
		if (err) {
		  done(err);
		  return;
		}
	
		res.response.should.have.length(48);
		done();
      });
    });
  });

  describe('imageFeatures', function() {
    it('should get the right response format', function(done) {
      indico.imageFeatures(data[0], function(err, res) {
	    if (err) {
	      done(err);
	      return;
	    }

	    res.Features.should.have.length(2048);
	    done();
	  });
	});
  });
});
