var Promise = require('bluebird')
  , settings = require('./settings.js')
  , request = Promise.promisify(require('request'))
  , indico = module.exports
  ;

Promise.promisifyAll(request);

var services = [
  'political',
  'sentiment',
  'sentimentHQ',
  'language',
  'facialFeatures',
  'fer',
  'imageFeatures',
  'textTags'
];

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

var api_request = function(api) {
  var privateCloud, apiKey;

  return function(data, config) {
    apiKey = settings.resolveApiKey(config, indico.apiKey);
    privateCloud = settings.resolvePrivateCloud(config, indico.cloud);

    var body = {};
    body['data'] = data;

    var options = {
      method: 'POST',
      url: service(api, privateCloud, apiKey),
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'text/plain',
        'client-lib': 'node',
        'version-number': '0.3.1'
      }
    };

    return request(options).then(function(results){
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
  };
}


services.forEach(function(api) {
  indico[api] = api_request(api);
  indico['batch_' + api] = api_request(api + '/batch');
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function snakeCase(str) {
  return str.replace(/([A-Z])/g, function (char) {return '_' + char.toLowerCase();});
}

services.forEach(function(api) {
  indico[api] = api_request(api)
  indico['batch' + capitalize(api)] = api_request(api + '/batch')

  // camelCase + snake_case + lowercase supported
  for (api in indico) {
    indico[snakeCase(api)] = indico[api];
    indico[api.toLowerCase()] = indico[api];
  }
});

indico.posneg = indico.sentiment;
