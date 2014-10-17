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
];

var api_endpoints = {
  'local': 'http://localhost:9438/',
  'remote': 'http://apiv1.indico.io/'
}

function service(name, server) {
  return api_endpoints[server] + name;
}

var api_request = function(api, server) {
  return function(data, fn) {
    var body = {};
    body['data'] = data;
    
    var options = {
      method: 'POST',
      url: service(api, server),
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

indico.local = {}
services.forEach(function(api) {
  indico[api] = api_request(api, 'remote')
  indico.local[api] = api_request(api, 'local')
});

indico.posneg = indico.sentiment;
