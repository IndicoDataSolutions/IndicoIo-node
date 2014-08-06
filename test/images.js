var indico = require('..')
  , data = require('./data.json');

describe('Image', function() {
  describe('fer', function() {
    it('should get the right response format', function(done) {
      indico.fer(data[0], function(err, res) {
	if (err) {
	  done(err);
	  return;
	}
	
	Object.keys(res).should.be(['Angry', 'Sad', 'Neutral', 'Surprise', 'Fear', 'Happy'])
	done();
      });
    });
    
    it('should get the right response format', function(done) {
      indico.fer(data[1], function(err, res) {
	if (err) {
	  done(err);
	  return;
	}
	
	Object.keys(res).should.be(['Angry', 'Sad', 'Neutral', 'Surprise', 'Fear', 'Happy'])
	done();
      });
    });
  });

  describe('facialFeatures', function() {
    it('should get the right response format', function(done) {
      indico.facialFeatures(data[0], function(err, res) {
	if (err) {
	  done(err);
	  return;
	}
	
	Object.keys(res).should.be(['Angry', 'Sad', 'Neutral', 'Surprise', 'Fear', 'Happy'])
	done();
      });
    });
  });
});