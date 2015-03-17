var indico = require('../..')
  , data = require('../data.json')
  , should = require('chai').should();

describe('BatchImage', function () {
  describe('batchFer', function() {
    it('should get the right response format', function(done) {
      indico.batchFer([data], function(err, res) {
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
      indico.batchFacialFeatures([data], function(err, res) {
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
      indico.batchImageFeatures([data], function(err, res) {
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
});