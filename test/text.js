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

  describe('language', function() {
    it('should get the right response format', function(done) {
        indico.language('Quis custodiet ipsos custodes', function(err, res) {
            if (err) {
                done(err);
                return;
            }

            Object.keys(res).should.be([
                'English',
                'Spanish',
                'Tagalog',
                'Esperanto',
                'French',
                'Chinese',
                'French',
                'Bulgarian',
                'Latin',
                'Slovak',
                'Hebrew',
                'Russian',
                'German',
                'Japanese',
                'Korean',
                'Portuguese',
                'Italian',
                'Polish',
                'Turkish',
                'Dutch',
                'Arabic',
                'Persian (Farsi)',
                'Czech',
                'Swedish',
                'Indonesian',
                'Vietnamese',
                'Romanian',
                'Greek',
                'Danish',
                'Hungarian',
                'Thai',
                'Finnish',
                'Norwegian',
                'Lithuanian'
            ]);
            done();
        });
    });
  });
});