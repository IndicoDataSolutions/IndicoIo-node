var indico = require('../..')
  , settings = require('../../lib/settings.js')
  , should = require('chai').should()
  , fs = require('fs')
  , path = require('path')
  ;

var data = fs.readFileSync(path.join(__dirname, '..', 'base64.txt'), { encoding: 'utf8' });
console.warn = function () {};
describe('ImageRecognition', function () {
    if (settings.resolveApiKey() === false) {
      // skip test -- indico auth keys are not available
      console.warn('Api keys are now required. Skipping some tests.\nhttp://docs.indico.io/v2.0/docs/api-keys')
      return;
    }
    describe('single', function() {
      it('should get the right response format', function(done) {
        indico.imageRecognition(data, {'top_n': 3})
          .then(function(res){

            Object.keys(res).should.have.length(3);
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
        indico.imageRecognition([data, data], {'top_n': 3})
          .then(function(res){

            res.should.have.length(2);
            Object.keys(res[0]).should.have.length(3);
            done();
          })
          .catch(function(err) {

            done(err);
            return;
          })

      });
    });
});
