var indico = require('..')
  , settings = require('../lib/settings.js')
  , should = require('chai').should()
  , expandTilde = require('expand-tilde')
  , fs = require('fs')
  , ini = require('config-ini');

describe('Authentication', function() {
  describe('Direct config', function() {
    it('Should load configuration from a configuration file', function(done) {
      var apiKeyArg = "api_key_argument";
      var config = {
        'api_key': apiKeyArg,
      };

      // directly pass in arguments
      var apiKey = settings.apiKey(config);

      apiKey.should.equal(apiKeyArg);
      done();
    });
  });
  describe('Username and Password', function() {
    it('Should load configuration from environment variables', function(done) {
      var envApiKey = "api_key_env_variable";

      // set environment variables
      process.env.INDICO_API_KEY = envApiKey;
      var config = {};

      // read from environment variables
      var apiKey = settings.apiKey(config);

      apiKey.should.equal(envApiKey)
      done();
    });
  });
  describe('Username and Password', function() {
    it('Should load configuration from config file', function(done) {
      var apiKeyConfigFile = "api_key_config_file_var";
 
      // ensure process does not take precedence
      delete process.env.INDICO_API_KEY;

      config = {};

      // mock result of indicorc
      var configFile = {
        'auth': {
          'api_key': apiKeyConfigFile
        }
      };

      var apiKey = settings.apiKey(config, configFile);
      apiKey.should.equal(apiKeyConfigFile);
      done();
    });
  });
});

describe('Private Cloud', function() {
  describe('Direct config', function() {
    it('Should load configuration from a configuration file', function(done) {
      var privateCloud = "private_cloud_argument";
      var config = {
        "privateCloud": privateCloud
      };

      // directly pass in arguments
      var cloud = settings.privateCloud(config);

      cloud.should.equal(privateCloud);
      done();
    });
  });
  describe('Username and Password', function() {
    it('Should load configuration from environment variables', function(done) {
      var privateCloud = "private_cloud_env_variable";

      // set environment variables
      process.env.INDICO_CLOUD = privateCloud;
      var config = {};

      // read from environment variables
      var cloud = settings.privateCloud(config);

      cloud.should.equal(privateCloud);
      done();
    });
  });
  describe('Username and Password', function() {
    it('Should load configuration from config file', function(done) {
      var privateCloud = "private_cloud_config_file";

      // ensure process does not take precedence
      delete process.env.INDICO_CLOUD;

      config = {};

      // mock result of indicorc
      var configFile = {
        'private_cloud': {
            'cloud': privateCloud
        }
      };

      var cloud = settings.privateCloud(config, configFile);
      cloud.should.equal(privateCloud)
      done();
    });
  });
});
