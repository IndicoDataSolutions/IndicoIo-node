var request = require('request')
  , settings = require('./settings.js')
  , indico = module.exports

var headers = {
  'Content-type': 'application/json', 
  'Accept': 'text/plain'
};

var services = [
  'political',
  'sentiment',
  'language',
  'facialFeatures',
  'fer',
  'imageFeatures',
  'textTags'
];

var public_api = 'http://apiv2.indico.io/'

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
  return function(data, config, fn) {

    if (typeof(config) === 'function') {
      fn = config;
      config = undefined;
    }

    var apiKey = settings.apiKey(config);
    var privateCloud = settings.privateCloud(config);

    var body = {};
    body['data'] = data;

    var options = {
      method: 'POST',
      url: service(api, privateCloud, apiKey),
      headers: headers,
      body: JSON.stringify(body)
    };
    
    fn = fn || function() {};

    request(options, function(err, res, body) {
      if (err) {
        fn(err);
        return;
      }
      
      if (res.statusCode !== 200) {
        fn(body);
        return;
      }
      
      fn(null, JSON.parse(body).results);
    });
        
    return this;
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
  return str.replace(/([A-Z])/g, function ($1) {return '_' + $1.toLowerCase();});
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
