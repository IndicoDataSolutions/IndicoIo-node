var indico = require('../..')
  , settings = require('../../lib/settings.js')
  , should = require('chai').should()
  , fs = require('fs')
  , path = require('path');
  ;

var pdfFile = path.join(__dirname, '..', 'test.pdf');
var pdfUrl = "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf";

// Silence Warnings
describe('PDF', function() {
  if (settings.resolveApiKey() === false) {
    // skip test -- indico auth keys are not available
    console.warn('Api keys are now required. Skipping some tests.\nhttp://docs.indico.io/v2.0/docs/api-keys')
    return;
  }

  describe('url support', function() {
    it('should get the right response format', function(done) {
      indico.pdfExtraction(pdfUrl)
        .then(function(res){

          console.log(res);
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
      indico.pdfExtraction(pdfFile)
        .then(function(res){
          console.log(res);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        })
    });
  });
});
