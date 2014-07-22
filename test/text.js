var indico = require('..');

describe('Text', function() {
  describe('political', function() {
    it('should get the right response format', function(done) {
      indico.political("Guns don't kill people, people kill people.", function(err, res) {
	if (err) {
	  done(err);
	  return;
	}

	Object.keys(res).should.be(['Libertarian', 'Liberal', 'Conservative', 'Green']);
	done();
      });
      
    });
  });
  
  describe('posneg', function() {
    it('should get the right response format', function(done) {
      indico.sentiment('Really enjoyed the movie.', function(err, res) {
	if (err) {
	  done(err);
	  return;
	}
	
	Object.keys(res).should.be(['Sentiment']);
	done();
      });
    });
  });
});