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
  ]
};

function service(name) {
  return 'http://api.indico.io/' + name;
}

Object.keys(services).forEach(function(k) {
  services[k].forEach(function(name) {
    indico[name] = function(data, fn) {
      var body = {};
      body[k] = data;
      
      var options = {
	method: 'POST',
	url: service(name),
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
  });
});

indico.posneg = indico.sentiment;
