var indico = require('../..')
  , settings = require('../../lib/settings.js')
  , should = require('chai').should()
  ;

var data = "A working API is critical to the success of a company";

console.warn = function () {};
describe('TestKeywordsV2', function () {
    if (settings.resolveApiKey() === false) {
      // skip test -- indico auth keys are not available
      console.warn('Api keys are now required. Skipping some tests.\nhttp://indico.io/docs')
      return;
    }
    describe('single', function() {
      it('should get the right response format', function(done) {
        indico.keywords(data, {'version': 2})
          .then(function(res){
            Object.keys(res).forEach(function(key) {
              data.indexOf(key).should.not.eql(-1);
            });
            done();
          })
          .catch(function(err) {

            done(err);
            return;
          })

      });
    });
    describe('batch', function() {
      it('should get the right response format', function(done) {
        indico.keywords([data, data], {'version': 2})
          .then(function(res){

            res.should.have.length(2);
            Object.keys(res[0]).forEach(function(key) {
              data.indexOf(key).should.not.eql(-1);
            });
            done();
          })
          .catch(function(err) {

            done(err);
            return;
          })

      });
    });
});
