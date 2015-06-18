var Promise = require('bluebird'),
  services = require('./services.js'),
  settings = require('./settings.js'),
  image = require('./image.js'),
  request = Promise.promisify(require('request')),
  indico = module.exports;

Promise.promisifyAll(request);

var public_api = 'http://apiv2.indico.io/'

indico.apiKey = false;
indico.cloud = false;

function service(name, privateCloud, apiKey) {
  if (privateCloud) {
    var prefix = 'http://' + privateCloud + '.indico.domains/';
    var url = prefix + name.toLowerCase();
  } else {
    var url = public_api + name.toLowerCase();
  }
  url = url + "?key=" + apiKey;
  return url
}


var make_request = function (name, data, config) {
  var apiKey = settings.resolveApiKey(config, indico.apiKey);
  var privateCloud = settings.resolvePrivateCloud(config, indico.cloud);

  var body = {};
  body['data'] = data;

  for (var key in config) {
    if (config.hasOwnProperty(key)
        && key !== 'apiKey'
        && key !== 'privateCloud') {
      body[key] = config[key];
    }
  }

  var options = {
    method: 'POST',
    url: service(name, privateCloud, apiKey),
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
    return JSON.parse(body).results;
  });
}

var api_request = function (name, api, batch) {
  return function (data, config) {
    if (api.type === "image") {
      return image.preprocess(data, api.size, batch).then(function (packaged) {
        return make_request(name, packaged, config);
      });
    } else {
      return make_request(name, data, config);
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
  indico['batch_' + name] = api_request(name + '/batch', api, true);
  indico['batch' + capitalize(name)] = api_request(name + '/batch', api, true);
});

// camelCase + snake_case + lowercase supported
for (name in indico) {
  indico[snakeCase(name)] = indico[name];
  indico[name.toLowerCase()] = indico[name];
}

indico.posneg = indico.sentiment;
