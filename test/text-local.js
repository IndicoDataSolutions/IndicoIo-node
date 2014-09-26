var indico = require('..').local;
var should = require('chai').should() 

console.log(indico)

describe('Text', function() {
  describe('political (local)', function() {
    it('should get the right response format', function(done) {
      indico.political("Guns don't kill people, people kill people.", function(err, res) {
      if (err) {
        done(err);
        return;
      }

      Object.keys(res).should.have.length(4);
      done();
      });  
    });
  });
  
  describe('posneg (local)', function() {
    it('should get the right response format', function(done) {
      indico.sentiment('Really enjoyed the movie.', function(err, res) {
      if (err) {
        done(err);
        return;
      }
  
      Object.keys(res).should.have.length(1)
      done();
      });
    });
  });

  describe('language (local)', function() {
    it('should get the right response format', function(done) {
      indico.language('Quis custodiet ipsos custodes', function(err, res) {
        if (err) {
          done(err);
          return;
        }

        // number of languages
        Object.keys(res).should.have.length(33)
        done();
      });
    });
  });
});