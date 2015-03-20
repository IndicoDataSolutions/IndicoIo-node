var indico = require('..')
  , settings = require('../lib/settings.js')
  , should = require('chai').should()
  , expandTilde = require('expand-tilde')
  , fs = require('fs')
  , ini = require('config-ini');

describe('Authentication', function() {
  describe('Direct config', function() {
    it('Should load configuration from a configuration file', function(done) {
      var username = "username_argument";
      var password = "password_argument";
      var config = {
        'username': username,
        'password': password
      };

      // directly pass in arguments
      var auth = settings.auth(config);

      auth.username.should.equal(username);
      auth.password.should.equal(password);
      done();
    });
  });
  describe('Username and Password', function() {
    it('Should load configuration from environment variables', function(done) {
      var username = "username_env_variable";
      var password = "password_env_variable";

      // set environment variables
      process.env.INDICO_USERNAME = username;
      process.env.INDICO_PASSWORD = password;
      var config = {};

      // read from environment variables
      var auth = settings.auth(config);

      auth.username.should.equal(username);
      auth.password.should.equal(password);
      done();
    });
  });
  describe('Username and Password', function() {
    it('Should load configuration from config file', function(done) {
      var username = "username_config_file_var";
      var password = "password_config_file_var";

      // ensure process does not take precedence
      delete process.env.INDICO_USERNAME;
      delete process.env.INDICO_PASSWORD;

      config = {};

      // mock result of indicorc
      var configFile = {
        'auth': {
            'username': username,
            'password': password
        }
      };

      var auth = settings.auth(config, configFile);
      auth.username.should.equal(username);
      auth.password.should.equal(password);
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
