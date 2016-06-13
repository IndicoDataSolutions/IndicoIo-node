var indico = require('../..')
  , settings = require('../../lib/settings.js')
  , should = require('chai').should()
  ;

console.warn = function () {};
describe('TestPoliticalsV2', function () {
    if (settings.resolveApiKey() === false) {
      // skip test -- indico auth keys are not available
      console.warn('Api keys are now required. Skipping some tests.\nhttp://indico.io/docs')
      return;
    }

    describe('political', function() {
      it('should get the right response format', function(done) {

        indico.political("Guns don't kill people, people kill people.", {'version': 1})
          .then(function(res) {
            Object.keys(res).should.have.length(4);
            done();
          })
          .catch(function(err){
              done(err);
              return;
          });
      });
    });

    describe('batchPolitical', function() {

      it('should get the right response format', function(done) {

        var examples = [
          "Guns don't kill people, people kill people.",
          "Steps are being taken to address inflation."
        ];

        indico.political(examples, {'version': 1})
          .then(function(res) {

            res.should.have.length(examples.length);
            Object.keys(res[0]).should.have.length(4);
            done();
          })
          .catch(function(err){

            done(err);
            return;
          });
      });
    });

    describe('politicalv2', function() {
      it('should get the right response format', function(done) {

        indico.political("Guns don't kill people, people kill people.", {'version': 2})
          .then(function(res) {
            Object.keys(res).should.have.length(4);
            done();
          })
          .catch(function(err){
              done(err);
              return;
          });
      });
    });

    describe('batchPoliticalv2', function() {

      it('should get the right response format', function(done) {

        var examples = [
          "Guns don't kill people, people kill people.",
          "Steps are being taken to address inflation."
        ];

        indico.political(examples, {'version': 2})
          .then(function(res) {

            res.should.have.length(examples.length);
            Object.keys(res[0]).should.have.length(4);
            done();
          })
          .catch(function(err){

            done(err);
            return;
          });
      });
    });

});
