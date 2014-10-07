var request = require('request')
  , indico = module.exports;

var headers = {
  'Content-type': 'application/json', 
  'Accept': 'text/plain'
};

var services = {
  'text': [
    'political',
    'sentiment',
    'language'
  ],
  'face': [
    'facialFeatures',
    'fer'
  ],
  'image': [
    'imageFeatures'
  ]
};

var api_endpoints = {
  'local': 'http://localhost:9438/',
  'remote': 'http://api.indico.io/'
}

function service(name, server) {
  return api_endpoints[server] + name;
}

var api_request = function(key, api, server) {
  return function(data, fn) {
    var body = {};
    body[key] = data;
    
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
      
      fn(null, JSON.parse(body));
    });
        
    return this;
  };
}

indico.local = {}
Object.keys(services).forEach(function(key) {
  services[key].forEach(function(api) {
    indico[api] = api_request(key, api, 'remote')
    indico.local[api] = api_request(key, api, 'local')
  });
});

indico.posneg = indico.sentiment;
