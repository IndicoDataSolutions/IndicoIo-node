var indico = require('../..')
, settings = require('../../lib/settings.js')
, should = require('chai').should()
, expect = require('chai').expect
;


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
});
