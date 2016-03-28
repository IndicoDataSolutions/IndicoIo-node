var indico = require('..')
  , settings = require('../lib/settings.js')
  , services = require('../lib/services.js')
  , should = require('chai').should()
  , expandTilde = require('expand-tilde')
  , fs = require('fs')
  , ini = require('config-ini');

describe('Authentication', function() {
  describe('Direct config', function() {
    it('Should load configuration from a configuration file', function(done) {
      var apiKeyArg = "api_key_argument";
      var config = {
        'apiKey': apiKeyArg,
      };

      // directly pass in arguments
      var apiKey = settings.resolveApiKey(config);

      apiKey.should.equal(apiKeyArg);
      done();
    });
  });
  describe('API Key', function() {
    it('Should load configuration from environment variables', function(done) {
      var envApiKey = "api_key_env_variable";
      var savedKey = process.env.INDICO_API_KEY;

      // set environment variables
      process.env.INDICO_API_KEY = envApiKey;
      var config = {};

      // read from environment variables
      var apiKey = settings.resolveApiKey(config);

      apiKey.should.equal(envApiKey)
      process.env.INDICO_API_KEY = savedKey;
      done();
    });
  });
  describe('API Key', function() {
    it('Should load configuration from config file', function(done) {
      var apiKeyConfigFile = "api_key_config_file_var";

      // ensure process does not take precedence
      var savedKey = process.env.INDICO_API_KEY;
      delete process.env.INDICO_API_KEY;

      config = {};

      // mock result of indicorc
      var configFile = {
        'auth': {
          'api_key': apiKeyConfigFile
        }
      };

      var apiKey = settings.resolveApiKey(config, false, configFile);
      apiKey.should.equal(apiKeyConfigFile);
      process.env.INDICO_API_KEY = savedKey;
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
      var cloud = settings.resolvePrivateCloud(config);

      cloud.should.equal(privateCloud);
      done();
    });
  });
  describe('API Key', function() {
    it('Should load configuration from environment variables', function(done) {
      var privateCloud = "private_cloud_env_variable";

      // set environment variables
      var savedCloud = process.env.INDICO_CLOUD;
      process.env.INDICO_CLOUD = privateCloud;
      var config = {};

      // read from environment variables
      var cloud = settings.resolvePrivateCloud(config);

      cloud.should.equal(privateCloud);
      process.env.INDICO_CLOUD = savedCloud;
      done();
    });
  });
  describe('Private Cloud', function() {
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

      var cloud = settings.resolvePrivateCloud(config, false, configFile);
      cloud.should.equal(privateCloud)
      done();
    });
  });
  describe('Private Cloud', function() {
    it('Should assign proper priority to module variables for config', function(done) {
      var privateCloud = "private_cloud_config_file";

      config = {};

      // mock result of indicorc
      var configFile = {
        'private_cloud': {
          'cloud': privateCloud
        }
      };

      var moduleConfig = 'module_private_cloud';
      var cloud = settings.resolvePrivateCloud(config, moduleConfig, configFile);
      cloud.should.equal(moduleConfig);
      done();
    });
  });
  describe('API Key', function() {
    it('Should assign proper priority to module variables for config', function(done) {
      var apiKey = "api_key_config_file";

      config = {};

      // mock result of indicorc
      var configFile = {
        'auth': {
          'api_key': apiKey
        }
      };

      var moduleConfig = 'module_api_key';
      var cloud = settings.resolvePrivateCloud(config, moduleConfig, configFile);
      cloud.should.equal(moduleConfig);
      done();
    });
  });
  describe('Local Deployment', function() {
    it('Should allow easy access to local deploy of indico APIs', function(done) {
      indico.host = "localhost:8000"
      var url = services.service("/sentiment", null)
      url.should.equal("http://localhost:8000/sentiment")
      indico.host = "apiv2.indico.io"
      done();
    });
  });
});
