var indico = require('../..')
  , data = require('../data.json')
  , should = require('chai').should();

describe('BatchImage', function () {
  describe('batchFer', function() {
    it('should get the right response format', function(done) {
      indico.batchFer([data])
        .then(function(res){

          res.should.have.length(1);
          Object.keys(res[0]).should.have.length(6);
          done();
        })
        .catch(function(err) {

          done(err);
          return;
        })

    });
  });

  describe('batchFacialFeatures', function() {
    it('should get the right response format', function(done) {
      indico.batchFacialFeatures([data])
        .then(function(res){

          res.should.have.length(1);
          Object.keys(res[0]).should.have.length(48);
          done();
        })
        .catch(function(err) {

          done(err);
          return;
        })

    });
  });

  describe('batchImageFeatures', function() {
    it('should get the right response format', function(done) {
      indico.batchImageFeatures([data])
        .then(function(res){

          res.should.have.length(1);
          Object.keys(res[0]).should.have.length(2048);
          done();
        })
        .catch(function(err) {

          done(err);
          return;
        })

    });
  });
});
