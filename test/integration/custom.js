var indico = require('../..')
  , settings = require('../../lib/settings.js')
  , should = require('chai').should()
  , expect = require('chai').expect
  ;


describe('Custom', function() {
  this.timeout(30000);

  var testData = [
    ['aidan rules', 'test_writer'],
    ['sometimes tests are fun', 'test_writer'],
    ['meow meow meow', 'aidan']
  ];

  if (settings.resolveApiKey() === false) {
    // skip test -- indico auth keys are not available
    console.warn('Api keys are now required. Skipping some tests.\nhttp://docs.indico.io/v2.0/docs/api-keys')
    return;
  }

  describe('addData', function() {
    it('should add a single example to a collection', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");

        testCollection.info().then(function(res) {
          res['status'].should.equal('no examples');
          testCollection.addData(testData[0]).then(function() {
            testCollection.info().then(function(res) {
              res['number_of_examples'].should.equal(1);
              done();
            });
          });
        });
      });
    });

    it('should batch add data to a collection', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");

        testCollection.info().then(function(res) {
          res['status'].should.equal('no examples');
          testCollection.addData(testData).then(function() {
            testCollection.info().then(function(res) {
              res['number_of_examples'].should.equal(3);
              done();
            });
          });
        });
      });
    });

    it('should return an error if no data is provided', function(done) {
      var testCollection = indico.Collection("test");

      testCollection.addData().catch(function(err) {
        err.should.have.property("message");
        done()
      })
    });
  });

  describe('removeData', function() {
    it('should remove data', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");
        testCollection.addData(testData).then(function() {
          testCollection.removeExample(['sometimes tests are fun']).then(function() {
            testCollection.info().then(function(res) {
              res['number_of_examples'].should.equal(2);
              done()
            });
          });
        });
      })
    });

    it('should batch remove examples', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");
        testCollection.addData(testData).then(function() {
          testCollection.removeExample(['sometimes tests are fun','aidan rules','meow meow meow']).then(function() {
            testCollection.info().then(function(res) {
              res['number_of_examples'].should.equal(0);
              done()
            });
          });
        });
      })
    });

    it('should return an error if no data is provided', function(done) {
      var testCollection = indico.Collection("test");

      testCollection.removeExample().catch(function(err) {
        err.should.have.property("message");
        done()
      })
    });
  });

  describe('train', function() {
    it('should train the model and set status to training', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");

        testCollection.addData(testData).then(function() {
          testCollection.train().then(function(res) {
            res['status'].should.equal('training');
            done();
          });
        });
      });
    });
  });

  describe('wait', function() {
    it('should wait for the model to be ready', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");

        testCollection.addData(testData).then(function() {
          testCollection.train().wait().then(function(res) {
            res['status'].should.equal('ready');
            done();
          });
        });
      });
    });
  });

  describe('info', function() {
    it('should return information if collection exists', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");

        testCollection
          .addData(testData)
          .wait()
          .info().then(function(res) {
            res['number_of_examples'].should.equal(3);
            done();
          });
      });
    });

    it('should return null collection info if no data has been added', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");

        testCollection.info().then(function(res) {
          expect(res['model_type']).to.equal(null);
          done();
        });
      });
    });
  });

  describe('predict', function() {
    it('should respond with a dictionary on single input', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");

        testCollection.addData(testData).then(function() {
          testCollection.train().then(testCollection.wait).then(function() {
            testCollection.predict('aidan rules').then(function(res) {
              res['test_writer'].should.be.above(0.5);
              done();
            });
          });
        });
      });
    });

    it('should respond with a list of dictionaries on batch input', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");

        testCollection.addData(testData).then(function() {
          testCollection.train().then(testCollection.wait).then(function() {
            testCollection.predict(['aidan rules', 'meow meow meow']).then(function(res) {
              res.length.should.be.above(1);
              res[0]['test_writer'].should.be.above(0.5);
              done();
            });
          });
        });
      });
    });

    it('should return an error if no data is provided', function(done) {
      var testCollection = indico.Collection("test");

      testCollection.predict().then(function(res) {
        console.log("This should not be executed");
      }).catch(function(err) {
        err.should.have.property("message");
        done();
      });
    });
  });

  describe('clear', function() {
    it('should clear collection', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");
        testCollection.addData(testData).then(function(res) {
          testCollection.info().then(function(res) {
            res['number_of_examples'].should.equal(3);

            testCollection.clear().then(function() {
              var testCollection2 = indico.Collection("test");
              testCollection2.info().then(function(res) {
                res['number_of_examples'].should.equal(0);
                done()
              })
            })
          });
        });
      });
    });
  })

  describe('rename', function() {
    it('should rename collection', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");
        testCollection.addData(testData).then(function() {
          testCollection.train().then(testCollection.wait).then(function() {
            testCollection.rename("test2").then(function() {
              testCollection.collection.should.equal('test2');
              testCollection.clear().then(function() {
                done();
              })
            })
          });
        });
      });
    });
  })

  describe('register', function() {
    it('should register collection', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");
        testCollection.addData(testData).then(function() {
          testCollection.train().then(testCollection.wait).then(function() {
            testCollection.register().then(function() {
              testCollection.info().then(function(info) {
                info['registered'].should.equal(true);
                info['public'].should.equal(false);
                testCollection.deregister().then(function() {
                  testCollection.info().then(function(info) {
                    info['registered'].should.equal(false);
                    info['public'].should.equal(false);
                    done();
                  })
                })
              });
            });
          });
        });
      });
    });
  })

  describe('register public', function() {
    it('should register public collection', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");
        testCollection.addData(testData).then(function() {
          testCollection.train().then(testCollection.wait).then(function() {
            var config = {'make_public': true};
            testCollection.register(config).then(function() {
              testCollection.info().then(function(info) {
                info['registered'].should.equal(true);
                info['public'].should.equal(true);
                testCollection.deregister().then(function() {
                  testCollection.info().then(function(info) {
                    info['registered'].should.equal(false);
                    info['public'].should.equal(false);
                    done();
                  })
                })
              });
            });
          });
        });
      });
    });
  })


  describe('authorize', function() {
    it('should authorize another user to access a registered collection', function(done) {
      indico.Collection("test").clear().then(function() {
        var testCollection = indico.Collection("test");
        testCollection.addData(testData).then(function() {
          testCollection.train().then(testCollection.wait).then(function() {
            testCollection.register().then(function() {
              testCollection.authorize('contact@indico.io').then(function() {
                testCollection.info().then(function(info) {
                  info['permissions']['read'].should.contain('contact@indico.io');
                  testCollection.deauthorize('contact@indico.io').then(function() {
                    testCollection.deregister().then(function() {
                      done();
                    })
                  })
                });
              });
            });
          });
        });
      });
    });
  })


});
