var request = require('request')
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

var public_api = 'http://apiv1.indico.io/'

function service(name, config) {
  if (config !== undefined && config['privateCloud'] !== undefined) {
    var prefix = 'http://' + config['privateCloud'] + '.indico.domains/';
    return prefix + name.toLowerCase()
  }
  return public_api + name.toLowerCase()
}

var api_request = function(api) {
  return function(data, config, fn) {

    if (typeof(config) === 'function') {
      fn = config;
      config = undefined;
    }

    if (config !== undefined) {
      var encoded_auth = new Buffer(config.username + ":" + config.password).toString("base64");
      headers['Authorization'] = "Basic " + encoded_auth;
    }

    var body = {};
    body['data'] = data;

    var options = {
      method: 'POST',
      url: service(api, config),
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

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.snakeCase = function() {
  return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
}

indico.local = {}
services.forEach(function(api) {
  indico[api] = api_request(api)
  indico['batch' + api.capitalize()] = api_request(api + '/batch')

  // camelCase + snake_case + lowercase supported
  for (api in indico) {
    indico[api.snakeCase()] = indico[api];
    indico[api.toLowerCase()] = indico[api];
  }

  for (api in indico.local) {
    indico.local[api.snakeCase()] = indico.local[api];
    indico.local[api.toLowerCase()] = indico.local[api];
  }
});

indico.posneg = indico.sentiment;
