var indico = require('../..')
  , settings = require('../../lib/settings.js')
  , data = require('../data.json')
  , should = require('chai').should()
  ;

describe('BatchImage', function () {
  if (settings.resolveApiKey() === false) {
    // skip test -- indico auth keys are not available
    console.warn('Api keys are now required. Skipping some tests.\nhttp://docs.indico.io/v2.0/docs/api-keys')
    return;
  }
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

describe('Image', function() {
  if (settings.resolveApiKey() === false) {
    // skip test -- indico auth keys are not available
    console.warn('Api keys are now required. Skipping some tests.\nhttp://docs.indico.io/v2.0/docs/api-keys')
    return;
  }
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
  if (settings.resolveApiKey() === false) {
    // skip test -- indico auth keys are not available
    console.warn('Api keys are now required. Skipping some tests.\nhttp://docs.indico.io/v2.0/docs/api-keys')
    return;
  }
  describe('batch fer', function() {
    it('should get the right response format', function(done) {


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

