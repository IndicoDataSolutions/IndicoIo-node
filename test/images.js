var indico = require('..')
  , data = require('./data.json')
  , settings = require('../lib/settings.js')
  , should = require('chai').should();

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

describe('Batch Image', function() {
  describe('batch fer', function() {
    it('should get the right response format', function(done) {

      if (settings.auth === false) {
        // skip test -- indico auth keys are not available
        done();
      }

      var examples = [data, data];
      indico.batchFer(examples, function(err, res) {
        if (err) {
          done(err);
          return;
        }
    
        res.should.have.length(examples.length);
        Object.keys(res[0]).should.have.length(6);
        done();
      });
    });
  });

  describe('batch facialFeatures', function() {
    it('should get the right response format', function(done) {

      if (settings.auth === false) {
        // skip test -- indico auth keys are not available
        done();
      }

      var examples = [data, data];
      indico.batchFacialFeatures(examples, function(err, res) {
        if (err) {
          done(err);
          return;
        }
    
        res.should.have.length(examples.length);
        res[0].should.have.length(48);
        done();
      });
    });
  });

  describe('batch imageFeatures', function() {
    it('should get the right response format', function(done) {

      if (settings.auth === false) {
        // skip test -- indico auth keys are not available
        done();
      }

      var examples = [data, data];
      indico.batchImageFeatures(examples, function(err, res) {
        if (err) {
          done(err);
          return;
        }

        res.should.have.length(examples.length);
        res[0].should.have.length(2048);
        done();
      });
    });
  });
});
