var Promise = require('bluebird')
  , settings = require('./settings.js')
  , image = require('./image.js')
  , pdf = require('./pdf.js')
  , request = Promise.promisify(require('request'));

Promise.promisifyAll(request);

var base = {};
base.apiKey = false;
base.cloud = false;
base.host = 'apiv2.indico.io';

function detectBatch(data) {
  return Object.prototype.toString.call(data).indexOf("Array") > -1;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

function service(name, privateCloud) {
  var url_protocol = "https";

  /* given a set of parameters, returns the proper url for the REST api*/
  if (privateCloud) {
    var url = privateCloud + '.indico.domains' + name;
  } else {
    var url = base.host + name;
  }

  if (!endsWith(base.host, "indico.io") && !endsWith(base.host, "indico.domains")) {
    url_protocol = "http"
  }

  return url_protocol + "://" + url;
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

var makeRequest = function (name, version, data, batch, config) {
  var apiKey = settings.resolveApiKey(config, base.apiKey);
  var privateCloud = settings.resolvePrivateCloud(config, base.cloud);

  // Params passed in as keyword arguments
  var apis = config ? config['apis'] : false;
  var body = {};

  body['data'] = data;
  body = addKeywordArguments(body, config);

  if (name.indexOf('custom') > -1 && batch) {
    name = '/custom/batch/' + name.split('custom/')[1];
  } else {
    name = (batch ? name + "/batch" : name);
  }

  urlParams = {};
  if (apis) {
      urlParams["apis"] = apis.join(",");
  }

  if (version) {
      urlParams["version"] = version;
  }

  var options = {
    method: 'POST',
    url: service(name, privateCloud),
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
      'Accept': 'text/plain',
      'client-lib': 'node',
      'version-number': '0.9.0',
      'X-ApiKey': apiKey
    },
    qs: urlParams
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
      return new Error(JSON.parse(body).error)
    }
    results = JSON.parse(body).results;
    results = postprocess(results, name);

    return results
  });
}

var apiRequest = function (api, batch) {
  return function (data, config) {
    config = config || {}

    // use api defaults when present
    config = extend(config, api.config || {});

    var batch = batch || detectBatch(data);
    var version = config.version || api.version;

    // Keywords Multilingual must be version 1
    if ("language" in config && config["language"] != "english") {
      version = 1;
    }

    if (api.type === "image") {
      var size = (api.name === "fer" && config["detect"]) ? false : api.size;
      return image.preprocess(data, size, api.min_axis, batch).then(function(packaged) {
        return makeRequest(api.endpoint, version, packaged, batch, config);
      });
    } else if (api.type === "pdf") {
      return pdf.preprocess(data, batch).then(function(packaged) {
        return makeRequest(api.endpoint, version, packaged, batch, config);
      });
    } else {
      return makeRequest(api.endpoint, version, data, batch, config);
    }
  };
}

module.exports = {
  'base': base,
  'service': service,
  'detectBatch': detectBatch,
  'makeRequest': makeRequest,
  'addKeywordArguments': addKeywordArguments,
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
       , version: 2
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
       , version: 2
    },
    {
         name: 'people'
       , type: 'text'
       , endpoint: '/people'
       , version: 2
    },
    {
         name: 'places'
       , type: 'text'
       , endpoint: '/places'
       , version: 2
    },
    {
         name: 'organizations'
       , type: 'text'
       , endpoint: '/organizations'
       , version: 2
    },
    {
         name: 'namedEntities'
       , type: 'text'
       , endpoint: '/namedentities'
       , version: 2
    },
    {
         name: 'textFeatures'
       , type: 'text'
       , endpoint: '/textfeatures'
       , synonyms: false
    },
    {
         name: 'emotion'
       , type: 'text'
       , endpoint: '/emotion'
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
       , size: 512
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
    },
    {
         name: 'summarization'
       , type: 'text'
       , endpoint: '/summarization'
    },
    {
         name: 'pdfExtraction'
       , type: 'pdf'
       , endpoint: '/pdfextraction'
    }
  ]
};
