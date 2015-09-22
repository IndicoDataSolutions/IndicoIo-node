var indico = require('../..')
, settings = require('../../lib/settings.js')
, fs = require('fs')
, path = require('path')
, should = require('chai').should()
, expect = require('chai').expect
;

var data = fs.readFileSync(path.join(__dirname, '..', 'base64.txt'), { encoding: 'utf8' });

describe('Versioning', function() {
    if (settings.resolveApiKey() === false) {
        // skip test -- indico auth keys are not available
        console.warn('Api keys are now required. Skipping some tests.\nhttp://docs.indico.io/v2.0/docs/api-keys')
        return;
    }
    describe('version present', function() {
        it('should get a valid response', function(done) {

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
    describe('version 2 for image features', function() {
      it('should get the right response format', function(done) {
        indico.imageFeatures(data, {"version": 2})
          .then(function(res){

            Object.keys(res).should.have.length(4096);
            done();
          })
          .catch(function(err) {

            done(err);
            return;
          })

      });
    });
});
