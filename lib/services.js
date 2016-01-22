var Promise = require('bluebird')
  , settings = require('./settings.js')
  , image = require('./image.js')
  , request = Promise.promisify(require('request'));

Promise.promisifyAll(request);

var public_api = 'https://apiv2.indico.io'

var base = {};
base.apiKey = false;
base.cloud = false;

function detectBatch(data) {
  return Object.prototype.toString.call(data).indexOf("Array") > -1;
}

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

var makeRequest = function (name, data, batch, config) {
  var apiKey = settings.resolveApiKey(config, base.apiKey);
  var privateCloud = settings.resolvePrivateCloud(config, base.cloud);
  var body = {};
  body['data'] = data;

  body = addKeywordArguments(body, config);
  apis = config ? config['apis'] : false
  version = config ? config['version'] : false
  if (name.indexOf('custom') > -1 && batch) {
    name = '/custom/batch/' + name.split('custom/')[1]
  } else {
    name = (batch ? name + "/batch" : name)
  }

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
    var warning = res.headers['X-Warning'];

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

var apiRequest = function (api, batch) {
  return function (data, config) {
    if (batch) {
      console.warn(
        "The `batch" + capitalize(api.name) + "` function will be deprecated in the next major upgrade. " +
        "Please call `" + api.name.replace("batch", "") +
        "` instead with the same arguments"
      )
    }
    var batch = batch || detectBatch(data);

    if (api.version != null) {
      if (config) {
        if (!('v' in config || 'version' in config)) {
          config["version"] = api.version;
        }
      } else {
        config = {"version": api.version};
      }
    }
    if (api.config != null) {
      if (config) {
        _.extend(config, api.config);
      } else {
        config = api.config;
      }
    }

    if (api.type === "image") {
      var size = (api.name === "fer" && config && config["detect"]) ? false : api.size;
      return image.preprocess(data, size, api.min_axis, batch).then(function (packaged) {
        return makeRequest(api.endpoint, packaged, batch, config);
      });
    } else {
      return makeRequest(api.endpoint, data, batch, config);
    }
  };
}

module.exports = {
  'base': base,
  'detectBatch': detectBatch,
  'makeRequest': makeRequest,
  'apiRequest': apiRequest,
  'services': [
    {
         name: 'intersections'
       , type: 'text'
       , endpoint: '/apis/intersections'
    },
    {
         name: 'twitterEngagement'
       , type: 'text'
       , endpoint: '/twitterengagement'
    },
    {
         name: 'political'
       , type: 'text'
       , endpoint: '/political'
    },
    {
         name: 'sentiment'
       , type: 'text'
       , endpoint: '/sentiment'
    },
    {
         name: 'sentimentHQ'
       , type: 'text'
       , endpoint: '/sentimenthq'
    },
    {
         name: 'personality'
       , type: 'text'
       , endpoint: '/personality'
    },
    {
         name: 'personas'
       , type: 'text'
       , endpoint: '/personality'
       , config: {'persona': true}
    },
    {
         name: 'language'
       , type: 'text'
       , endpoint: '/language'
    },
    {
         name: 'textTags'
       , type: 'text'
       , endpoint: '/texttags'
    },
    {
         name: 'keywords'
       , type: 'text'
       , endpoint: '/keywords'
    },
    {
         name: 'namedEntities'
       , type: 'text'
       , endpoint: '/namedentities'
    },
    {
         name: 'people'
       , type: 'text'
       , endpoint: '/people'
    },
    {
         name: 'places'
       , type: 'text'
       , endpoint: '/places'
    },
    {
         name: 'organizations'
       , type: 'text'
       , endpoint: '/organizations'
    },
    {
         name: 'textFeatures'
       , type: 'text'
       , endpoint: '/textfeatures'
    },
    {
         name: 'analyzeText'
       , type: 'text'
       , endpoint: '/apis/multiapi'
    },
    {
         name: 'facialLocalization'
       , type: 'image'
       , size: false
       , endpoint: '/faciallocalization'
    },
    {
         name: 'facialFeatures'
       , type: 'image'
       , size: 48
       , endpoint: '/facialfeatures'
    },
    {
         name: 'fer'
       , type: 'image'
       , size: 48
       , endpoint: '/fer'
    },
    {
         name: 'imageFeatures'
       , type: 'image'
       , size: 144
       , min_axis: true
       , endpoint: '/imagefeatures'
       , version: 3
    },
    {
         name: 'imageRecognition'
       , type: 'image'
       , size: 144
       , min_axis: true
       , endpoint: '/imagerecognition'
    },
    {
         name: 'contentFiltering'
       , type: 'image'
       , size: 128
       , min_axis: true
       , endpoint: '/contentfiltering'
    },
    {
         name: 'analyzeImage'
       , type: 'image'
       , size: 64
       , endpoint: '/apis/multiapi'
    }
  ]
};
