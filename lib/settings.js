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
        reject(new Error('Could not find .indicorc and no local path was given'))
    }

    resolve(validPaths);
  })
  .then(ini.load);
}

var indicorc = loadIndicorc().then(function(indicorcFile) {
  return indicorcFile;
})

var resolveApiKey = function(config, moduleConfig, configFile) {
    /*
    Check whether auth credentials are provided via:
      - config: object passed in when function is called
      - moduleConfig: a constant defined in code after module import
      - environment variables: found in system environment
      - configFile: parsed from file at module import

    The last argument (configFile) is optional and is primarily
    provided to make testing simpler.
    */
    configFile = configFile || indicorc;

    var validConfig = Boolean(
        config !== undefined &&
        config !== null &&
        config.hasOwnProperty('apiKey')
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
        return config.apiKey
    } else if (moduleConfig) {
        return moduleConfig;
    } else if (validEnvironmentVariables) {
        return process.env.INDICO_API_KEY
    } else if (validConfigFile) {
        return configFile.auth.api_key
    }  else {
        return false;
    }
}

var resolvePrivateCloud = function(config, moduleConfig, configFile) {
  /*
  Check whether private cloud endpoints are provided via:
    - config: object passed in when function is called
    - moduleConfig: a constant defined in code after module import
    - environment variables: found in system environment
    - configFile: parsed from file at module import

  The second argument (configFile) is optional and is primarily
  provided to make testing simpler.
  */

  configFile = configFile || indicorc;

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
  } else if (moduleConfig) {
    return moduleConfig;
  } else if (validEnvironmentVariables) {
    return process.env.INDICO_CLOUD;
  } else if (validConfigFile) {
    return configFile.private_cloud.cloud;
  } else {
    return false;
  }
}

settings.resolveApiKey = resolveApiKey;
settings.resolvePrivateCloud = resolvePrivateCloud;
