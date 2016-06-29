var indico = require('../..')
  , settings = require('../../lib/settings.js')
  , should = require('chai').should()
  , expect = require('chai').expect
  ;

var compare_by_confidence = function(a, b) {
  if (a['confidence'] < b['confidence']) {
     return 1;
  }
  if (a['confidence'] > b['confidence']) {
     return -1;
  }
  // a must be equal to b
  return 0;
}

describe('Text', function() {
  this.timeout(10000);

  if (settings.resolveApiKey() === false) {
    // skip test -- indico auth keys are not available
    console.warn('Api keys are now required. Skipping some tests.\nhttp://indico.io/docs')
    return;
  }

  describe('emotion', function() {
    it('should get the right response format', function(done) {

      indico.emotion("I did it. I got into Grad School. Not just any program, but a GREAT program. :-)")
        .then(function(res) {
          Object.keys(res).should.have.length(5);
          done();
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  });

  describe('personality', function() {
    it('should get the right response format', function(done) {

      indico.personality("I love my friends!")
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

  describe('personas', function() {
    it('should get the right response format', function(done) {

      indico.personas("I love my friends!")
        .then(function(res) {
          Object.keys(res).should.have.length(16);
          done();
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  });

  describe('people', function() {
    it('should get the right response format', function(done) {

      var text = 'Barack Obama is scheduled to give a talk next Saturday at the White House.';
      indico.people(text)
        .then(function(res) {
          res.sort(compare_by_confidence)
          res[0]['text'].should.contain('Barack Obama')
          indico.people(text, {"version": 1})
            .then(function(resv1) {
              resv1.sort(compare_by_confidence)
              expect(Math.abs(res[0]['confidence'] - resv1[0]['confidence']) > .00001)
              done();
            })
            .catch(function(err){
              done(err);
              return;
            });
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })

  describe('people', function() {
    it('should get the right response format', function(done) {

      var text = 'Barack Obama is scheduled to give a talk next Saturday at the White House.';
      indico.people([text, text])
        .then(function(res) {
          res[0].sort(compare_by_confidence)
          res[0][0]['text'].should.contain('Barack Obama')
          indico.people([text, text], {"version": 1})
            .then(function(resv1) {
              resv1.sort(compare_by_confidence)
              expect(Math.abs(res[0][0]['confidence'] - resv1[0][0]['confidence']) > .00001)
              done();
            })
            .catch(function(err){
              done(err);
              return;
            });
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })

  describe('places', function() {
    it('should get the right response format', function(done) {

      var text = 'Lets all go to Virginia beach before it gets too cold to wander outside.';
      indico.places(text)
        .then(function(res) {
          res.sort(compare_by_confidence)
          res[0]['text'].should.contain('Virginia')
           indico.places(text, {"version": 1})
            .then(function(resv1) {
              resv1.sort(compare_by_confidence)
              expect(Math.abs(res[0]['confidence'] - resv1[0]['confidence']) > .00001)
              done();
            })
            .catch(function(err){
              done(err);
              return;
            });
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })

  describe('places', function() {
    it('should get the right response format', function(done) {

      var text = 'Lets all go to Virginia beach before it gets too cold to wander outside.';
      indico.places([text, text])
        .then(function(res) {
          res[0].sort(compare_by_confidence)
          res[0][0]['text'].should.contain('Virginia')
          indico.places([text, text], {"version": 1})
            .then(function(resv1) {
              resv1.sort(compare_by_confidence)
              expect(Math.abs(res[0][0]['confidence'] - resv1[0][0]['confidence']) > .00001)
              done();
            })
            .catch(function(err){
              done(err);
              return;
            });
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })

  describe('organizations', function() {
    it('should get the right response format', function(done) {

      var text = "A year ago, the New York Times published confidential comments about ISIS' ideology by Major General Michael K. Nagata, then U.S. Special Operations commander in the Middle East.";
      indico.organizations(text)
        .then(function(res) {
          res.sort(compare_by_confidence)
          res[0]['text'].should.contain('U.S. Special Operations')
          indico.organizations(text, {"version": 1})
            .then(function(resv1) {
              resv1.sort(compare_by_confidence)
              expect(Math.abs(res[0]['confidence'] - resv1[0]['confidence']) > .00001)
              done();
            })
            .catch(function(err){
              done(err);
              return;
            });
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })

  describe('organizations', function() {
    it('should get the right response format', function(done) {

      var text = "A year ago, the New York Times published confidential comments about ISIS' ideology by Major General Michael K. Nagata, then U.S. Special Operations commander in the Middle East.";
      indico.organizations([text, text])
        .then(function(res) {
          res[0].sort(compare_by_confidence)
          res[0][0]['text'].should.contain('U.S. Special Operations')
          indico.organizations([text, text], {"version": 1})
            .then(function(resv1) {
              resv1.sort(compare_by_confidence)
              expect(Math.abs(res[0][0]['confidence'] - resv1[0][0]['confidence']) > .00001)
              done();
            })
            .catch(function(err){
              done(err);
              return;
            });
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })

  describe('relevance', function() {
    it('should get the right response format', function(done) {

      indico.relevance('president', 'president')
        .then(function(res) {
          res.should.be.above(0.5);
          done();
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })

  describe('relevance', function() {
    it('should get the right response format', function(done) {

      indico.relevance(['president', 'Barack Obama'], ['president', 'prime minister'])
        .then(function(res) {
          res[0][0].should.be.above(0.5);
          res.should.have.length(2);
          res[0].should.have.length(2);
          done();
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })

  describe('text features', function() {
    it('should get the right response format', function(done) {

      indico.textFeatures('Queen of England')
        .then(function(res) {
          res.should.have.length(300);
          done();
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })

  describe('text features batch', function() {
    it('should get the right response format', function(done) {

      indico.textFeatures(['Queen of England', 'Prime Minister of Canada'])
        .then(function(res) {
          res.should.have.length(2);
          res[0].should.have.length(300);
          res[1].should.have.length(300);
          done();
        })
        .catch(function(err){
            done(err);
            return;
        });
    });
  })


  describe('sentiment', function() {
    it('should get the right response format', function(done) {
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

  describe('twitter_engagement', function() {
    it('should get the right response format', function(done) {
      indico.twitterEngagement('#Breaking rt if you <3 pic.twitter.com @Startup')
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

  describe('sentimentHQ', function() {
    it('should get the right response format', function(done) {
      indico.sentimentHQ('Really enjoyed the movie.')
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
      indico.textTags('Really enjoyed the movie.')
        .then(function(res){
          // number of categories
          Object.keys(res).should.have.length(111)
          done();
        })
        .catch(function(err){
          done(err);
          return;
        });
    });
  });


  describe('analyzeText', function() {
    it('should get results from multiple text apis', function(done) {

      var example = 'Really enjoyed the movie.';

      indico.analyzeText(example, {'apis': ['sentiment', 'textTags']})
        .then(function(res){
          Object.keys(res).should.have.length(2);
          done();
        })
        .catch(function(err){
          done(err);
          return;
        });
    });
  });

  describe('Keyword Arguments Function', function() {
    it('Keyword arguments should function when passed into config', function(done) {
      indico.textTags('Really enjoyed the movie.', {'top_n': 5})
        .then(function(res){

          // number of categories
          Object.keys(res).should.have.length(5);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });
    });
  });

  describe('keywords', function() {
    it('should get the right response format', function(done) {
      indico.keywords("A working api is key to our young company's success", {top_n: 3})
        .then(function(res){

          // number of keywords
          Object.keys(res).should.have.length(3);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });
    });
  });

  describe('keywords', function() {
    it('should get the right response format with specified language', function(done) {
      text = "La semaine suivante, il remporte sa premiere victoire, dans la descente de Val Gardena en Italie, près de cinq ans après la dernière victoire en Coupe du monde d'un Français dans cette discipline, avec le succès de Nicolas Burtin à Kvitfjell."
      indico.keywords(text, {top_n: 3, language: 'French'})
        .then(function(res){

          // number of keywords
          Object.keys(res).should.have.length(3)
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });
    });
  });

  describe('keywords', function() {
    it('should get the right response format with auto detect language', function(done) {
      text = "La semaine suivante, il remporte sa premiere victoire, dans la descente de Val Gardena en Italie, près de cinq ans après la dernière victoire en Coupe du monde d'un Français dans cette discipline, avec le succès de Nicolas Burtin à Kvitfjell."
      indico.keywords(text, {top_n: 3, language: 'detect'})
        .then(function(res){

          // number of keywords
          Object.keys(res).should.have.length(3);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });
    });
  });
});

describe('BatchText', function() {
  if (settings.resolveApiKey() === false) {
    // skip test -- indico auth keys are not available
    console.warn('Api keys are now required. Skipping some tests.\nhttp://docs.indico.io/v2.0/docs/api-keys')
    return;
  }

  describe('batchPersonality', function() {
    it('should get the right response format', function(done) {

      var examples = [
        "I love my friends!",
        "I like to be alone."
      ];

      indico.personality(examples)
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

  describe('batchPersonas', function() {

    it('should get the right response format', function(done) {

      var examples = [
        "I love my friends!",
        "I like to be alone."
      ];

      indico.personas(examples)
        .then(function(res) {

          res.should.have.length(examples.length);
          Object.keys(res[0]).should.have.length(16);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });
    });
  });

  describe('batchSentiment', function() {
    it('should get the right response format', function(done) {

      var examples = [
        'Really enjoyed the movie.',
        'Worst day ever.'
      ];

      indico.sentiment(examples)
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

  describe('batchSentimentHQ', function() {
    it('should get the right response format', function(done) {

      var examples = [
        'Really enjoyed the movie.',
        'Worst day ever.'
      ];

      indico.sentimentHQ(examples)
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

  describe('batchTwitterEngagement', function() {
    it('should get the right response format', function(done) {

      var examples = [
        'Pic.twitter.com rt if #breaking',
        'Worst tweet ever'
      ];

      indico.twitterEngagement(examples)
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

  describe('batchLanguage', function() {
    it('should get the right response format', function(done) {

      var examples = [
        'Quis custodiet ipsos custodes',
        'Clearly an english sentence'
      ];
      indico.language(examples)
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

  describe('batchTextTags', function() {
    it('should get the right response format', function(done) {

      var examples = [
        'Really enjoyed the movie.',
        'Not looking forward to rain tomorrow'
      ];

      indico.textTags(examples)
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

  describe('batchKeywords', function() {
    it('should get the right response format', function(done) {
      var examples = [
        'Really enjoyed the movie.',
        'Not looking forward to rain tomorrow'
      ];
      indico.keywords(examples, {top_n:3})
        .then(function(res){

          res.should.have.length(examples.length);
          Object.keys(res[0]).should.have.length(3);
          done();
        })
        .catch(function(err){
          done(err);
          return;
        });
    });
  });

  describe('batchAnalyzeText', function() {
    it('should get results from multiple text apis', function(done) {
      var examples = [
        'Really enjoyed the movie.',
        'Not looking forward to rain tomorrow'
      ];
      indico.analyzeText(examples, {'apis': ['sentiment', 'textTags']})
        .then(function(res){
          Object.keys(res).should.have.length(2);
          res['sentiment'].should.have.length(2);
          done();
        })
        .catch(function(err){
          done(err);
          return;
        });
    });
  });

  describe('intersections', function() {
    var examples = [
      'Really enjoyed the movie.',
      'Not looking forward to rain tomorrow',
      'Our apis go together like pb and j'
    ];

    it('should get the right response format in api mode', function(done) {

      indico.intersections(examples, {'apis': ['textTags', 'sentiment']})
      .then(function (res){
        expect(Object.keys(res)).to.have.length(111);
        expect(res['golf']).to.have.property('sentiment');
        done()
      })
      .catch(function(err){
        done(err);
        return;
      });
    });

    it('should get the right response format in historic mode', function(done) {
        this.timeout(5000);
      indico.analyzeText(examples, {'apis': ['textTags', 'sentiment']})
      .then(function (res) {
          indico.intersections(res, {'apis': ['textTags', 'sentiment']})
          .then(function (res){
              expect(res['golf']).to.have.property('sentiment');
              expect(Object.keys(res)).to.have.length(111);
            done();
          })
          .catch(function(err){
            done(err);
            return;
          });
        })
        .catch(function(err){
          done(err);
          return;
        });
    });
  });

  describe('batchPersonality', function() {

    it('should get the right response format', function(done) {

      var examples = [
        "I love my friends!",
        "I like to be alone."
      ];

      indico.personality(examples)
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

  describe('batchPersonas', function() {

    it('should get the right response format', function(done) {

      var examples = [
        "I love my friends!",
        "I like to be alone."
      ];

      indico.personas(examples)
        .then(function(res) {

          res.should.have.length(examples.length);
          Object.keys(res[0]).should.have.length(16);
          done();
        })
        .catch(function(err){

          done(err);
          return;
        });
    });
  });
});
