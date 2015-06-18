var Promise = require('bluebird'),
  services = require('./services.js'),
  settings = require('./settings.js'),
  image = require('./image.js'),
  request = Promise.promisify(require('request')),
  indico = module.exports;

Promise.promisifyAll(request);

var textServices = [
  'political',
  'sentiment',
  'language',
  'textTags',
];

var imageServices = [
  'facialFeatures',
  'fer',
  'imageFeatures',
];

var otherServices = [
  'predictText',
  'predictImage'
]

var services = textServices.concat(imageServices).concat(otherServices)

var public_api = 'http://apiv2.indico.io/'

indico.apiKey = false;
indico.cloud = false;

function service(name, privateCloud, apiKey, apis) {
  /* given a set of parameters, returns the proper url for the REST api*/
  if (privateCloud) {
    var prefix = 'http://' + privateCloud + '.indico.domains/';
    var url = prefix + name;
  } else {
    var url = public_api + name;
  }
  url = url + "?key=" + apiKey;
  if (apis !== undefined) {
    url = url + "&apis=" + apis.join();
  }
  return url
}

function formatResults(results, nameMap) {
  var formatted_results = {};
  for (result in results) {
    if ('results' in results[result]) {
      formatted_results[nameMap[result]] = results[result]['results'];
    } else {
      formatted_results[nameMap[result]] = results[result];
    }
  }
  return formatted_results;
}

var make_request = function (name, data, batch, config) {
  var apiKey = settings.resolveApiKey(config, indico.apiKey);
  var privateCloud = settings.resolvePrivateCloud(config, indico.cloud);

  var body = {};
  body['data'] = data;

  for (var key in config) {

    // pass along additional keyword args
    if (config.hasOwnProperty(key) 
        && key !== 'apiKey'
        && key !== 'privateCloud') {
      body[key] = config[key];
    } 

    // standardization for multi-api support
    if (key === 'apis') {
      apis = config['apis'];
      for (apiName in apis) {
        standardized = apis[apiName].toLowerCase();
        nameMap[standardized] = apis[apiName]
        apis[apiName] = standardized;
      }

    }
  }

  // translate api name for batch api
  if (otherServices.indexOf(api) !== -1) {
    api = 'apis';
  }

  if (batch) {
    api += '/batch'
  }

  api = api.toLowerCase();

  var options = {
    method: 'POST',
    url: service(api, privateCloud, apiKey, apis),
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
      'Accept': 'text/plain',
      'client-lib': 'node',
      'version-number': '0.3.1'
    }
  };

  return request(options).then(function (results) {
    var res = results[0];
    var body = results[1];
    /*
    TODO: Make sure this matches the API headers
    */
    var warning = res.headers['X-Deprecation-Warning'];

    if (warning) {
      console.warn(warning);
    }

    if (res.statusCode !== 200) {
      return body;
    }
    results = JSON.parse(body).results;
    if (api.indexOf('apis') === 0) {
      results = formatResults(results, nameMap);
    }
    return results
  });
}

var api_request = function (name, api, batch) {
  return function (data, config) {
    if (api.type === "image") {
      return image.preprocess(data, api.size, batch).then(function (packaged) {
        return make_request(name, packaged, batch, config);
      });
    } else {
      return make_request(name, data, batch, config);
    }
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function snakeCase(str) {
  return str.replace(/([A-Z])/g, function (char) {
    return '_' + char.toLowerCase();
  });
}

services.forEach(function (api) {
  var name = api.name;
  indico[name] = api_request(name, api);
  indico['batch_' + name] = api_request(name, api, true);
  indico['batch' + capitalize(name)] = api_request(name, api, true);
});

// camelCase + snake_case + lowercase supported
for (name in indico) {
  indico[snakeCase(name)] = indico[name];
  indico[name.toLowerCase()] = indico[name];
}

indico.posneg = indico.sentiment;
