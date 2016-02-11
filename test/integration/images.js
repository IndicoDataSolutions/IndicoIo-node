var indico = require('../..')
  , settings = require('../../lib/settings.js')
  , should = require('chai').should()
  , image = require('../../lib/image.js')
  , lwip = require('lwip')
  , fs = require('fs')
  , path = require('path');
  ;

var data = fs.readFileSync(path.join(__dirname, '..', 'base64.txt'), { encoding: 'utf8' });
 // Silence Warnings
console.warn = function () {};
describe('BatchImage', function () {
  if (settings.resolveApiKey() === false) {
    // skip test -- indico auth keys are not available
    console.warn('Api keys are now required. Skipping some tests.\nhttp://docs.indico.io/v2.0/docs/api-keys')
    return;
  }
  describe('batchFer', function() {
    it('should get the right response format', function(done) {
      indico.fer([data])
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

  describe('batchContentFiltering', function() {
    it('should get the right response format', function(done) {
      indico.contentFiltering([data])
        .then(function(res){

          res.should.have.length(1);
          res[0].should.be.below(.5);
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
      indico.facialFeatures([data])
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

  describe('batchFacialLocalization', function() {
    it('should get the right response format', function(done) {
      indico.facialLocalization([data])
        .then(function(res){

          res.should.have.length(1);
          Object.keys(res[0]).should.have.length(1);
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
      indico.imageFeatures([data])
        .then(function(res){

          res.should.have.length(1);
          Object.keys(res[0]).should.have.length(4096);
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

  describe('url support', function() {
    it('should get the right response format', function(done) {
      indico.fer("https://s3-us-west-2.amazonaws.com/indico-test-data/face.jpg")
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


  describe('contentFiltering', function() {
    it('should get the right response format', function(done) {
      indico.contentFiltering(data)
        .then(function(res){

          res.should.be.below(.5)
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

  describe('facialLocalization', function() {
    it('should get the right response format', function(done) {
      indico.facialLocalization(data)
        .then(function(res){

          res.should.have.length(1);
          Object.keys(res[0]).should.have.length(2);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        })

    });
  });

  describe('imageFeatures', function() {
    this.timeout(5000);
    it('should get the right response format', function(done) {
      indico.imageFeatures(data)
        .then(function(res){

          res.should.have.length(4096);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        })
    });
  });

  describe('base64', function() {
    it('should get the right response format', function(done) {
      indico.imageFeatures(data)
        .then(function(res){

          res.should.have.length(4096);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        })
    });
  });

  describe('filepath', function() {
    it('should get the right response format', function(done) {
      var filePath = path.join(__dirname, '..', 'face1.png')
      indico.imageFeatures(filePath)
        .then(function(res){

          res.should.have.length(4096);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        })
    });
  });

  describe('imageResizing', function() {
    it('should get the right sized image in b64', function(done) {
      image.preprocess(data, 48, false)
        .then(function(res){
          lwip.open(new Buffer(res, 'base64'), 'png', function (err, image) {
              if (err) {
                  return;
              }
              image.width().should.equal(48)
              done();
          });
      });
    });
  });

  describe('analyzeImage', function() {
    it('should get the right response format', function(done) {
      indico.analyzeImage(data, {'apis': ['imageFeatures', 'facialFeatures']})
        .then(function(res) {
          Object.keys(res).should.have.length(2);
          Object.keys(res['imageFeatures']).should.have.length(4096)
          done();
        })
        .catch(function(err){

          done(err);
          return;
        })
    });
  });

  describe('batchAnalyzeImage', function() {
    it('should get the right response format', function(done) {
      indico.analyzeImage([data], {'apis': ['imageFeatures', 'facialFeatures']})
        .then(function(res){
          res['imageFeatures'].should.have.length(1)
          res['imageFeatures'][0].should.have.length(4096)
          done();
        })
        .catch(function(err){

          done(err);
          return;
        })
    });
  });
});
