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

function service(name, privateCloud, apiKey, apis) {
  /* given a set of parameters, returns the proper url for the REST api*/
  if (privateCloud) {
    var prefix = 'http://' + privateCloud + '.indico.domains/';
    var url = prefix + name;
  } else {
    var url = public_api + name;
  }
  url = url + "?key=" + apiKey;
  if (apis) {
    url = url + "&apis=" + apis.join();
  }
  return url
}

function formatResults(results, nameMap) {
  var formatted_results = {};
  for (result in results) {
    if ('results' in results[result]) {
      formatted_results[nameMap[result]] = results[result]['results'];
    } else {
      formatted_results[nameMap[result]] = results[result];
    }
  }
  return formatted_results;
}

function addKeywordArguments(body, config) {
  // pass along additional keyword args in JSON body
  for (var key in config) {
    if (key !== 'apiKey' && key !== 'privateCloud') {
      body[key] = config[key];
    }
  }
  return body;
}

function standardizeApiNames(config, nameMap) {
  // standardization for multi-api support
  for (var key in config) {
    if (key === 'apis') {
      var apis = config['apis'];
      for (apiName in apis) {
        standardized = apis[apiName].toLowerCase();
        nameMap[standardized] = apis[apiName]
        apis[apiName] = standardized;
      }
      return apis
    }
  }
  return false;
}

function formatName(name, batch) {
  if (['predictText', 'predictImage'].indexOf(name) !== -1) {
    name = 'apis';
  }

  if (batch) {
    name += '/batch'
  }

  name = name.toLowerCase();
  return name;
}

function postprocess(results, name, nameMap) {
  if (name.indexOf('apis') === 0) {
    results = formatResults(results, nameMap);
  }
  return results;
}

var make_request = function (name, data, batch, config) {
  var apiKey = settings.resolveApiKey(config, indico.apiKey);
  var privateCloud = settings.resolvePrivateCloud(config, indico.cloud);
  var body = {};
  var nameMap = {};
  body['data'] = data;

  body = addKeywordArguments(body, config);
  apis = standardizeApiNames(config, nameMap);
  name = formatName(name, batch);

  var options = {
    method: 'POST',
    url: service(name, privateCloud, apiKey, apis),
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
    results = postprocess(results, name, nameMap);

    return results
  });
}

var api_request = function (name, api) {
  return function (data, config) {
    var batch = Object.prototype.toString.call(data).indexOf("Array") > -1;

    if (api.type === "image") {
      return image.preprocess(data, api.size, api.min_axis, batch).then(function (packaged) {
        return make_request(name, packaged, batch, config);
      });
    } else {
      return make_request(name, data, batch, config);
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
});

// camelCase + snake_case + lowercase supported
for (name in indico) {
  indico[snakeCase(name)] = indico[name];
  indico[name.toLowerCase()] = indico[name];
}

indico.posneg = indico.sentiment;
