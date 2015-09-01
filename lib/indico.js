var Promise = require('bluebird'),
  services = require('./services.js'),
  settings = require('./settings.js'),
  image = require('./image.js'),
  request = Promise.promisify(require('request')),
  indico = module.exports;

Promise.promisifyAll(request);

var public_api = 'https://apiv2.indico.io'

indico.apiKey = false;
indico.cloud = false;

function service(name, privateCloud, apiKey, apis, version) {
  /* given a set of parameters, returns the proper url for the REST api*/
  if (privateCloud) {
    var prefix = 'http://' + privateCloud + '.indico.domains';
    var url = prefix + name;
  } else {
    var url = public_api + name;
  }
  url = url + "?key=" + apiKey;
  if (apis) {
    url = url + "&apis=" + apis.join();
  }

  if (version) {
    url = url + "&version=" + version;
  }

  return url
}

function addKeywordArguments(body, config) {
  // pass along additional keyword args in JSON body
  for (var key in config) {
    if (key !== 'apiKey' && key !== 'privateCloud' && key !== 'apis') {
      body[key] = config[key];
    }
  }
  return body;
}

function postprocess(results, name) {
  if (name.indexOf('apis') === 1) {
      var formatted_results = {};
      for (api in results) {
        if ('results' in results[api]) {
          formatted_results[api] = results[api]['results'];
        } else {
          formatted_results[api] = results[api];
        }
      }
      return formatted_results;  }
  return results;
}

var make_request = function (name, data, batch, config) {
  var apiKey = settings.resolveApiKey(config, indico.apiKey);
  var privateCloud = settings.resolvePrivateCloud(config, indico.cloud);
  var body = {};
  body['data'] = data;

  body = addKeywordArguments(body, config);
  apis = config ? config['apis'] : false
  version = config ? config['version'] : false
  name = (batch ? name + "/batch" : name)

  var options = {
    method: 'POST',
    url: service(name, privateCloud, apiKey, apis, version),
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
    results = postprocess(results, name);

    return results
  });
}

var api_request = function (api, batch) {
  return function (data, config) {
    if (batch) {
      console.warn(
        "The `batch" + capitalize(api.name) + "` function will be deprecated in the next major upgrade. " +
        "Please call `" + api.name.replace("batch", "") +
        "` instead with the same arguments"
      )
    }
    var batch = batch || Object.prototype.toString.call(data).indexOf("Array") > -1;
    if (api.type === "image") {
      var size = (api.name === "fer" && config && config["detect"]) ? false : api.size;
      return image.preprocess(data, size, api.min_axis, batch).then(function (packaged) {
        return make_request(api.endpoint, packaged, batch, config);
      });
    } else {
      return make_request(api.endpoint, data, batch, config);
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
  indico[api.name] = api_request(api, false);
  indico["batch" + capitalize(api.name)] = api_request(api, true);
});

// camelCase + snake_case + lowercase supported
for (name in indico) {
  indico[snakeCase(name)] = indico[name];
  indico[name.toLowerCase()] = indico[name];
}

indico.posneg = indico.sentiment;
