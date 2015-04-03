var fs = require('fs')
    , path = require('path')
    , ini = require('config-ini')
    , expandTilde = require('expand-tilde')
    , deasync = require('deasync')
    , settings = module.exports;

var indicorc = function() {
    /*
    Search for valid indicorc files to use as configuration
    Load files in order of precendence if any are found
    */
    var localPath = path.resolve(process.cwd(), './.indicorc');
    var globalPath = expandTilde('~/.indicorc');
    var paths = [globalPath, localPath];
    
    var valid_paths = [];
    for (i in paths) {
        if (fs.existsSync(paths[i])) {
            valid_paths.push(paths[i]);
        }
    }

    var done = false;
    if (valid_paths.length > 0) {
        ini.load(valid_paths, function(err, config) {
            if (err) {
                throw new Error(err);
            } else {
                done = true;
            }
        });

        // block until the config file has been loaded
        while (!done) {
            deasync.runLoopOnce()
        }

        return ini
    }
}

var indicorcFile = indicorc();

var apiKey = function(config, configFile) {
    /*
    Check whether auth credentials are provided via:
      - function arguments
      - environment variables
      - configuration files

    The second argument (configFile) is optional and is primarily
    provided to make testing simpler.
    */
    configFile = configFile || indicorcFile;

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

var privateCloud = function(config, configFile) {
    /*
    Check whether private cloud endpoints are provided via:
      - function arguments
      - environment variables
      - configuration files

    The second argument (configFile) is optional and is primarily
    provided to make testing simpler.
    */
    configFile = configFile || indicorcFile;

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

settings.apiKey = apiKey;
settings.privateCloud = privateCloud;
