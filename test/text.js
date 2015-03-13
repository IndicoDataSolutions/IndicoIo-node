var indico = require('..');
var should = require('chai').should();

describe('BatchText', function () {
  var username = process.env.INDICO_USERNAME;
  var password = process.env.INDICO_PASSWORD;
  if (username && password) {
    var auth = {
      "username": username,
      "password": password
    }
    describe('batchPolitical', function() {
      it('should get the right response format', function(done) {
        indico.batchPolitical(["Guns don't kill people, people kill people."], auth, function(err, res) {
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
        indico.batchSentiment(['Really enjoyed the movie.'], auth, function(err, res) {
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
        indico.batchLanguage(['Quis custodiet ipsos custodes'], auth, function(err, res) {
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
        indico.batchTextTags(['Really enjoyed the movie.'], auth, function(err, res) {
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
  }
});

describe('Text', function() {
  describe('political', function() {
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
  
  describe('sentiment', function() {
    it('should get the right response format', function(done) {
      indico.sentiment('Really enjoyed the movie.', function(err, res) {
    	if (err) {
    	  done(err);
    	  return;
    	}

      res.should.be.above(0.5);
    	done();
      });
    });
  });

  describe('language', function() {
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

  describe('textTags', function() {
    it('should get the right response format', function(done) {
      indico.textTags('Really enjoyed the movie.', function(err, res) {
        if (err) {
          done(err);
          return;
        }

        // number of categories
        Object.keys(res).should.have.length(111)
        done();
      });
    });
  });
});