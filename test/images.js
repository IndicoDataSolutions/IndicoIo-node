var indico = require('..')
  , data = require('./data.json')
  , should = require('chai').should();

describe('BatchImage', function () {
  var username = process.env.INDICO_USERNAME;
  var password = process.env.INDICO_PASSWORD;
  if (username && password) {
    var auth = {
      "username": username,
      "password": password
    }

    describe('batchFer', function() {
      it('should get the right response format', function(done) {
        indico.batchFer([data], auth, function(err, res) {
        if (err) {
          done(err);
          return;
        }

        res.should.have.length(1);
        Object.keys(res[0]).should.have.length(6);
        done();
        });  
      });
    });

    describe('batchFacialFeatures', function() {
      it('should get the right response format', function(done) {
        indico.batchFacialFeatures([data], auth, function(err, res) {
        if (err) {
          done(err);
          return;
        }

        res.should.have.length(1);
        Object.keys(res[0]).should.have.length(48);
        done();
        });  
      });
    });

    describe('batchImageFeatures', function() {
      it('should get the right response format', function(done) {
        indico.batchImageFeatures([data], auth, function(err, res) {
        if (err) {
          done(err);
          return;
        }

        res.should.have.length(1);
        Object.keys(res[0]).should.have.length(2048);
        done();
        });  
      });
    });
  }
});

describe('Image', function() {
  describe('fer', function() {
    it('should get the right response format', function(done) {
      indico.fer(data, function(err, res) {
		if (err) {
		  done(err);
		  return;
		}
	
		Object.keys(res).should.have.length(6);
		done();
      });
    });
    
    it('should get the right response format', function(done) {
      indico.fer(data, function(err, res) {
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
      indico.facialFeatures(data, function(err, res) {
		if (err) {
		  done(err);
		  return;
		}
	
		res.should.have.length(48);
		done();
      });
    });
  });

  describe('imageFeatures', function() {
    it('should get the right response format', function(done) {
      indico.imageFeatures(data, function(err, res) {
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
