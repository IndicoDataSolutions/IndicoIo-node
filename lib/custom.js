var Promise = require('bluebird')
  , makeRequest = require('./services.js').makeRequest
  , addKeywordArguments = require('./services.js').addKeywordArguments;

var Collection = function(collection, config) {
  var _this = this;
  this.promise_chain = Promise.resolve();

  this.collection = collection;
  config = config || {};
  config['collection'] = collection;
  this.version = config["version"] || 1;
  this.baseConfig = config;

  this.addData = function(data, config) {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();

      if (typeof data === 'undefined') {
        var msg = "Must submit data in format ['data', 'label']. You can also submit multiple in a list.";
        deferred.reject(new Error(msg));
      }

      var batch = typeof data !== 'undefined' && typeof data[0] !== 'string';
      makeRequest('/custom/add_data', this.version, data, batch, config).then(function (res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  };

  this.removeExample = function(data, config) {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      if (typeof data === 'undefined') {
        var msg = "Must submit examples for removal in string format (i.e. 'example'). You can also submit multiple in a list.";
        deferred.reject(new Error(msg));
      }
      var batch = (typeof data !== 'undefined' && typeof data !== 'string') ? true : false;

      makeRequest('/custom/remove_example', this.version, data, batch, config).then(function(res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  }

  this.train = function(config) {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      makeRequest('/custom/train', this.version, {}, false, config).then(function(res) {
          deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  };

  this.wait = function(status, config) {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      var waitForTrained = setInterval(function() {
        makeRequest('/custom/info', this.version, {}, false, config).then(function(collection) {
          if (!collection) {
            var msg = _this.collection + " does not exist at the moment! Make sure this is something that has been created";
            deferred.reject(new Error(msg));
          }
          if (collection && collection['status'] !== 'training') {
            if (collection["status"] !== "ready") {
              var msg = _this.collection + " failed with status " + collection["status"];
              deferred.reject(new Error(msg));
            }
            clearInterval(waitForTrained);
            deferred.resolve(collection);
          }
        });
      }, 1000);
      return deferred.promise;
    });
    return _this;
  };

  this.info = function(config) {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      makeRequest('/custom/info', this.version, {}, false, config).then(function(collection) {
        if (collection['status'] === undefined) {
          deferred.resolve({
            model_type: null,
            input_type: null,
            number_of_examples: 0,
            status: 'no examples'
          });
        } else {
          deferred.resolve(collection);
        }
      })
      return deferred.promise;
    });
    return _this;
  }

  this.predict = function(data, config) {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      if (typeof data === 'undefined') {
        var msg = "Must submit data in string format 'data'. You can also submit multiple in a list.";
        deferred.reject(new Error(msg));
      }

      var batch = (typeof data !== 'undefined' && typeof data !== 'string') ? true : false;

      makeRequest('/custom/predict', this.version, data, batch, config).then(function(res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  };

  this.clear = function(config) {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      makeRequest('/custom/clear_collection', this.version, {}, false, config).then(function(res) {
          deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  }

  this.rename = function(name, config)  {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    config['name'] = name;
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();


      makeRequest('/custom/rename', this.version, {}, false, config).then(function(res) {
          _this.baseConfig['collection'] = name;
          _this.collection = name;
          deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  }

  this.register = function(config)  {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      makeRequest('/custom/register', this.version, {}, false, config).then(function(res) {
          deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  }

  this.deregister = function(config)  {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();

      makeRequest('/custom/deregister', this.version, {}, false, config).then(function(res) {
          deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  }

  this.authorize = function(email, config)  {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    config['email'] = email;
    if (config['permission_type'] === undefined) {
      config['permission_type'] = 'read';
    }
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();

      makeRequest('/custom/authorize', this.version, {}, false, config).then(function(res) {
          deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  }

  this.deauthorize = function(email, config)  {
    var config = addKeywordArguments(config || {}, _this.baseConfig);
    config['email'] = email;
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();

      makeRequest('/custom/deauthorize', this.version, {}, false, config).then(function(res) {
          deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  }

  this.then = function(callback) {
    return this.promise_chain.then(callback);
  }

  this.catch = function(errback) {
    return this.promise_chain.catch(errback);
  }

  return this;
}

module.exports = Collection
