var indico = require('../..');
var should = require('chai').should();

describe('BatchText', function () {
  describe('batchPolitical', function() {
    it('should get the right response format', function(done) {
      indico.batchPolitical(["Guns don't kill people, people kill people."], function(err, res) {
      if (err) {
        done(err);
        return;
      }

      res.should.have.length(1);
      Object.keys(res[0]).should.have.length(4);
      done();
      });  
    });
  });

  describe('batchSentiment', function() {
    it('should get the right response format', function(done) {
      indico.batchSentiment(['Really enjoyed the movie.'], function(err, res) {
      if (err) {
        done(err);
        return;
      }

      res.should.have.length(1);
      res.should.be.above(0.5);
      done();
      });
    });
  });

  describe('batchLanguage', function() {
    it('should get the right response format', function(done) {
      indico.batchLanguage(['Quis custodiet ipsos custodes'], function(err, res) {
        if (err) {
          done(err);
          return;
        }

        res.should.have.length(1)
        // number of languages
        Object.keys(res[0]).should.have.length(33)
        done();
      });
    });
  });

  describe('batchTextTags', function() {
    it('should get the right response format', function(done) {
      indico.batchTextTags(['Really enjoyed the movie.'], function(err, res) {
        if (err) {
          done(err);
          return;
        }

        res.should.have.length(1)
        // number of categories
        Object.keys(res[0]).should.have.length(111)
        done();
      });
    });
  });
});