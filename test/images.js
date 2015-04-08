var indico = require('..')
  , data = require('./data.json')
  , settings = require('../lib/settings.js')
  , should = require('chai').should();

describe('Image', function() {
  describe('fer', function() {
    it('should get the right response format', function(done) {
      indico.fer(data)
        .then(function(res){

      		Object.keys(res).should.have.length(6);
      		done();
        })
        .catch(function(err){

          done(err);
          return;
        })

    });
  });

  describe('facialFeatures', function() {
    it('should get the right response format', function(done) {
      indico.facialFeatures(data)
        .then(function(res){

      		res.should.have.length(48);
      		done();
        })
        .catch(function(err){

          done(err);
          return;
        })

    });
  });

  describe('imageFeatures', function() {
    it('should get the right response format', function(done) {
      indico.imageFeatures(data)
        .then(function(res){

    	    res.should.have.length(2048);
    	    done();
        })
        .catch(function(err){

          done(err);
          return;
        })
  	});
  });
});

describe('Batch Image', function() {
  describe('batch fer', function() {
    it('should get the right response format', function(done) {

      if (settings.apiKey() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      var examples = [data, data];
      indico.batchFer(examples)
        .then(function(res){

          res.should.have.length(examples.length);
          Object.keys(res[0]).should.have.length(6);
          done();
        })
        .catch(function(err){
          done(err);
          return;
        })
    });
  });

  describe('batch facialFeatures', function() {
    it('should get the right response format', function(done) {

      if (settings.apiKey() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      var examples = [data, data];
      indico.batchFacialFeatures(examples)
        .then(function(res){

          res.should.have.length(examples.length);
          res[0].should.have.length(48);
          done();
        })
        .catch(function(err){
          done(err);
          return;
        })
    });
  });

  describe('batch imageFeatures', function() {
    it('should get the right response format', function(done) {

      if (settings.apiKey() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      var examples = [data, data];
      indico.batchImageFeatures(examples)
        .then(function(res){

          res.should.have.length(examples.length);
          res[0].should.have.length(2048);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });
    });
  });
});
