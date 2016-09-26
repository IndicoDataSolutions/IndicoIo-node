var indico = require('../..')
  , settings = require('../../lib/settings.js')
  , should = require('chai').should()
  ;

var data = "Most people have a story or two about teachers who really gave of themselves. But Natasha Fuller's most likely trumps everyone's. \
            Her teacher, Jodi Schmidt, gave her a kidney.\
            Natasha is an 8-year-old, a student at Oakfield Elementary School in Wisconsin. \
            She suffered from prune belly syndrome, a rare birth defect marked by urinary tract problems and weak abdominal muscles. \
            For the brave 2nd grader, the clock was ticking. \
            Natasha endured regular dialysis as she waited on the national donor list, desperately hoping for a kidney transplant. \
            Through it all, she attended school part-time with a bright smile.";

console.warn = function () {};
describe('TestSummarization', function () {
    if (settings.resolveApiKey() === false) {
      // skip test -- indico auth keys are not available
      console.warn('Api keys are now required. Skipping some tests.\nhttp://indico.io/docs')
      return;
    }
    describe('single', function() {
      it('should get the right response format', function(done) {
        indico.summarization(data, {top_n: 1})
          .then(function(res){
            res.length.should.eql(1);
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
        indico.summarization([data, data], {top_n: 3})
          .then(function(res){

            res.should.have.length(2);
            res[0].should.have.length(3);
            res[1].should.have.length(3);
            done();
          })
          .catch(function(err) {

            done(err);
            return;
          })

      });
    });
});
