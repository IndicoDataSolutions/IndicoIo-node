var indico = require('..');
var settings = require('../lib/settings.js')
var should = require('chai').should();

describe('Text', function() {
  describe('political', function() {
    it('should get the right response format', function(done) {
      if (settings.apiKey() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }


      indico.political("Guns don't kill people, people kill people.")
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

  describe('sentiment', function() {
    it('should get the right response format', function(done) {
      if (settings.apiKey() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      indico.sentiment('Really enjoyed the movie.')
      .then(function(res) {

        res.should.be.above(0.5);
        done();
      })
      .catch(function(err){

    	  done(err);
    	  return;
      });
    });
  });

  describe('language', function() {
    it('should get the right response format', function(done) {
      if (settings.apiKey() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      indico.language('Quis custodiet ipsos custodes')
        .then(function(res) {

          // number of languages
          Object.keys(res).should.have.length(33)
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });

    });
  });

  describe('textTags', function() {
    it('should get the right response format', function(done) {
      if (settings.apiKey() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      indico.textTags('Really enjoyed the movie.')
        .then(function(res){

          // number of categories
          Object.keys(res).should.have.length(111)
          done();
        })
        .catch(function(err){

          done(err);
          return;
        })

    });
  });
});

describe('BatchText', function() {
  describe('batch political', function() {
    if (settings.apiKey === false) {
      // skip test -- indico auth keys are not available
      done();
    }

    it('should get the right response format', function(done) {

      if (settings.auth() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      var examples = [
        "Guns don't kill people, people kill people.",
        "Steps are being taken to address inflation."
      ];

      indico.batchPolitical(examples)
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

  describe('batch sentiment', function() {
    if (settings.apiKey === false) {
      // skip test -- indico auth keys are not available
      done();
    }

    it('should get the right response format', function(done) {

      if (settings.auth() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      var examples = [
        'Really enjoyed the movie.',
        'Worst day ever.'
      ];

      indico.batchSentiment(examples)
        .then(function(res){

          res.should.have.length(examples.length);
          res[0].should.be.above(0.5);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });
    });
  });

  describe('batch language', function() {
    if (settings.apiKey === false) {
      // skip test -- indico auth keys are not available
      done();
    }

    it('should get the right response format', function(done) {

      if (settings.auth() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      var examples = [
        'Quis custodiet ipsos custodes',
        'Clearly an english sentence'
      ];
      indico.batchLanguage(examples)
      .then(function(res) {

        // number of languages
        res.should.have.length(examples.length);
        Object.keys(res[0]).should.have.length(33);
        done();
      })
      .catch(function(err){

        done(err);
        return;
      });

    });
  });

  describe('batch textTags', function() {
    if (settings.apiKey === false) {
      // skip test -- indico auth keys are not available
      done();
    }

    it('should get the right response format', function(done) {

      if (settings.auth() === false) {
        // skip test -- indico auth keys are not available
        done();
        return;
      }

      var examples = [
        'Really enjoyed the movie.',
        'Not looking forward to rain tomorrow'
      ];

      indico.batchTextTags(examples)
        .then(function(res){

          res.should.have.length(examples.length);
          Object.keys(res[0]).should.have.length(111);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });

    });
  });
});
