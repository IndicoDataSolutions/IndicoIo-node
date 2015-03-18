var indico = require('..');
var should = require('chai').should();

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

describe('BatchText', function() {
  describe('batch political', function() {
    it('should get the right response format', function(done) {
      var examples = [
        "Guns don't kill people, people kill people.",
        "Steps are being taken to address inflation."
      ];
      indico.batchPolitical(examples, function(err, res) {
      if (err) {
        done(err);
        return;
      }

      res.should.have.length(examples.length);
      Object.keys(res[0]).should.have.length(4);
      done();
      });  
    });
  });
  
  describe('batch sentiment', function() {
    it('should get the right response format', function(done) {
      var examples = [
        'Really enjoyed the movie.',
        'Worst day ever.'
      ];
      indico.batchSentiment(examples, function(err, res) {
      if (err) {
        done(err);
        return;
      }

      res.should.have.length(examples.length);
      res[0].should.be.above(0.5);
      done();
      });
    });
  });

  describe('batch language', function() {
    it('should get the right response format', function(done) {
      var examples = [
        'Quis custodiet ipsos custodes',
        'Clearly an english sentence'
      ];
      indico.batchLanguage(examples, function(err, res) {
        if (err) {
          done(err);
          return;
        }

        // number of languages
        res.should.have.length(examples.length);
        Object.keys(res[0]).should.have.length(33);
        done();
      });
    });
  });

  describe('batch textTags', function() {
    it('should get the right response format', function(done) {
      var examples = [
        'Really enjoyed the movie.',
        'Not looking forward to rain tomorrow'
      ];

      indico.batchTextTags(examples, function(err, res) {
        if (err) {
          done(err);
          return;
        }

        res.should.have.length(examples.length);
        Object.keys(res[0]).should.have.length(111);
        done();
      });
    });
  });
});
