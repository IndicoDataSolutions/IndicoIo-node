var services = require('./services.js').services
  , make_request = require('./services.js').make_request
  , api_request = require('./services.js').api_request
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
  indico[api.name] = api_request(api, false);
  indico["batch" + capitalize(api.name)] = api_request(api, true);
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
  return make_request('/custom/collections', {}, false, config);
}

indico.posneg = indico.sentiment;

module.exports = indico;
