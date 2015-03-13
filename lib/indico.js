var request = require('request')
  , indico = module.exports;

var headers = {
  'Content-type': 'application/json', 
  'Accept': 'text/plain'
};

var services = [
  'political',
  'sentiment',
  'language',
  'facialfeatures',
  'fer',
  'imagefeatures',
  'texttags'
];

var public_api = 'http://apiv1.indico.io/'

function service(name, config) {
  if (config !== undefined) {
    var prefix = 'http://' + config['privateCloud'] + '.indico.domains/';
    return prefix + name
  }
  return public_api + name
}

var api_request = function(api) {
  return function(data, config, fn) {

    if (typeof(config) === 'function') {
      fn = config;
      config = undefined;
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
  indico[api] = api_request(api)
});

indico.posneg = indico.sentiment;
