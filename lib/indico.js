var request = require('request')
  , indico = module.exports
  , auth = require('./auth.js')

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

    if (api.search('batch') != -1) {
      authed = authed || auth.query_auth(); 
      console.log(auth.query_auth());
    }
    
    var options = {
      method: 'POST',
      url: service(api, config),
      headers: headers,
      body: JSON.stringify(body),
      username: auth.username,
      password: auth.password
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
  indico['batch_' + api] = api_request(api + '/batch')
});

indico.posneg = indico.sentiment;
