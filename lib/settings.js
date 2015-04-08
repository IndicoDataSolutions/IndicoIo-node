var Promise = require('bluebird')
    , path = require('path')
    , fs = Promise.promisifyAll(require('fs'))
    , ini = Promise.promisifyAll(require('config-ini'))
    , expandTilde = require('expand-tilde')
    , settings = module.exports;

var loadIndicorc = function() {
  return new Promise(function(resolve, reject){
    /*
    Search for valid indicorc files to use as configuration
    Load files in order of precendence if any are found
    */

    var localPath = path.resolve(process.cwd(), './.indicorc');
    var globalPath = expandTilde('~/.indicorc');
    var paths = [globalPath, localPath];
    var validPaths = [];

    for (var i = path.length - 1; i >= 0; i--) {
        if (fs.existsSync(paths[i])) {
            validPaths.push(paths[i]);
        }
    }

    if (paths.length < 1) {
        reject('Could not find .indicorc and no local path was given');
    }

    resolve(validPaths);
  })
  .then(ini.load);
}

var apiKey = function(config, configFile) {
    /*
    Check whether auth credentials are provided via:
      - function arguments
      - environment variables
      - configuration files

    The second argument (configFile) is optional and is primarily
    provided to make testing simpler.
    */

    var validConfig = Boolean(
        config !== undefined &&
        config.hasOwnProperty('api_key')
    );

    var validEnvironmentVariables = Boolean(
        process.env.INDICO_API_KEY
    );

    var validConfigFile = Boolean(
        configFile !== undefined &&
        configFile.hasOwnProperty('auth') &&
        configFile.auth.hasOwnProperty('api_key')
    );
    if (validConfig) {
        return config.api_key
    } else if (validEnvironmentVariables) {
        return process.env.INDICO_API_KEY
    } else if (validConfigFile) {
        return configFile.auth.api_key
    }  else {
        return false;
    }
}

var auth = function(config, configFile) {
  /*
  Check whether auth credentials are provided via:
    - function arguments
    - environment variables
    - configuration files

  The second argument (configFile) is optional and is primarily
  provided to make testing simpler.
   */
  var validConfig = Boolean(
    config !== undefined &&
    config.hasOwnProperty('username') &&
    config.hasOwnProperty('password')
  );

  var validEnvironmentVariables = Boolean(
    process.env.INDICO_USERNAME &&
    process.env.INDICO_PASSWORD
  );

  var validConfigFile = Boolean(
    configFile !== undefined &&
    configFile.hasOwnProperty('auth') &&
    configFile.auth.hasOwnProperty('username') &&
    configFile.auth.hasOwnProperty('password')
  );

  if (validConfig) {
    return {
      'username': config.username,
      'password': config.password
    };
  } else if (validEnvironmentVariables) {
    return {
      'username': process.env.INDICO_USERNAME,
      'password': process.env.INDICO_PASSWORD
    };
  } else if (validConfigFile) {
    return {
      'username': configFile.auth.username,
      'password': configFile.auth.password
    };
  } else {
    return false;
  }
}

var privateCloud = function(config, configFile) {
  /*
  Check whether private cloud endpoints are provided via:
    - function arguments
    - environment variables
    - configuration files

  The second argument (configFile) is optional and is primarily
  provided to make testing simpler.
  */
  var validConfig = Boolean(
    config !== undefined &&
    config.hasOwnProperty('privateCloud')
  );

  var validEnvironmentVariables = Boolean(
    process.env.INDICO_CLOUD
  );

  var validConfigFile = Boolean(
    configFile !== undefined &&
    configFile.hasOwnProperty('private_cloud') &&
    configFile.private_cloud.hasOwnProperty('cloud')
  );

  if (validConfig) {
    return config.privateCloud;
  } else if (validEnvironmentVariables) {
    return process.env.INDICO_CLOUD;
  } else if (validConfigFile) {
    return configFile.private_cloud.cloud;
  } else {
    return false;
  }
}

settings.loadIndicorc = loadIndicorc;
settings.apiKey = apiKey;
settings.auth = auth;
settings.privateCloud = privateCloud;
