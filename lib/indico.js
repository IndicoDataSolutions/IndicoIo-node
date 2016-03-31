var services = require('./services.js').services
  , makeRequest = require('./services.js').makeRequest
  , apiRequest = require('./services.js').apiRequest
  , detectBatch = require('./services.js').detectBatch
  , Collection = require('./custom.js')
  , indico = require('./services.js').base;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function snakeCase(str) {
  return str.replace(/([A-Z])/g, function (char) {
    return '_' + char.toLowerCase();
  });
}

services.forEach(function (api) {
  indico[api.name] = apiRequest(api, false);
  indico["batch" + capitalize(api.name)] = apiRequest(api, true);
});

// camelCase + snake_case + lowercase supported
for (name in indico) {
  indico[snakeCase(name)] = indico[name];
  indico[name.toLowerCase()] = indico[name];
}

indico.Collection = function(collectionName, config) {
  return new Collection(collectionName, config);
}

indico.collections = function(config) {
  version = config['version'] || '1'
  delete config['version']
  return makeRequest('/custom/collections', version, {}, false, config);
}

indico.relevance = function(data, queries, config) {
  var batch = detectBatch(data);
  config = config || {};
  config.queries = queries
  version = config['version'] || '1'
  config.synonyms = config.synonyms || false;
  delete config['version']
  return makeRequest('/relevance', version, data, batch, config)
}
indico.posneg = indico.sentiment;

module.exports = indico;
