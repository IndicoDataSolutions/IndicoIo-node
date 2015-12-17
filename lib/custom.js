var Promise = require('bluebird')
  , makeRequest = require('./services.js').makeRequest;

var Collection = function(collection, config) {
  var _this = this;
  this.promise_chain = Promise.resolve();

  this.collection = collection;
  if (typeof config !== 'undefined') {
    config['collection'] = collection
  }
  this.baseConfig = config || {'collection': collection};

  this.addData = function(data) {
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();

      if (typeof data === 'undefined') {
        console.warn("Must submit data in format ['data', 'label']. You can also submit multiple in a list.");
      }

      var batch = typeof data !== 'undefined' && typeof data[0] !== 'string';
      makeRequest('/custom/add_data', data, batch, _this.baseConfig).then(function (res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  };

  this.removeExample = function(data) {
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      if (typeof data === 'undefined') {
        console.warn("Must submit examples for removal in string format 'example'. You can also submit multiple in a list.")
      }
      var batch = (typeof data !== 'undefined' && typeof data !== 'string') ? true : false;

      makeRequest('/custom/remove_example', data, batch, _this.baseConfig).then(function(res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  }

  this.train = function() {
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      makeRequest('/custom/train', {}, false, _this.baseConfig).then(function(res) {
          deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  };

  this.wait = function(status) {
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      var waitForTrained = setInterval(function() {
        makeRequest('/custom/collections', {}, false).then(function(collectionList) {
          if (!collectionList[_this.collection]) {
            console.warn(_this.collection + " does not exist at the moment! Make sure this is something that has been created");
          }
          if (collectionList[_this.collection] && collectionList[_this.collection]['status'] !== 'training') {
            clearInterval(waitForTrained);
            deferred.resolve(collectionList[_this.collection]);
          }
        });
      }, 1000);
      return deferred.promise;
    });
    return _this;
  };

  this.info = function() {
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();
      makeRequest('/custom/collections', {}, false).then(function(collectionList) {
        var status = collectionList[_this.collection];
        if (status !== undefined) {
          deferred.resolve(status);
        } else {
          deferred.resolve({
            model_type: null,
            input_type: null,
            number_of_examples: 0,
            status: 'no examples'
          });
        }
      });
      return deferred.promise;
    });
    return _this;
  }

  this.predict = function(data) {
    _this.promise_chain = _this.promise_chain.then(function() {
      if (typeof data === 'undefined') {
        console.warn("Must submit data in string format 'data'. You can also submit multiple in a list.")
      }

      var batch = (typeof data !== 'undefined' && typeof data !== 'string') ? true : false;

      var deferred = Promise.pending();
      makeRequest('/custom/predict', data, batch, _this.baseConfig).then(function(res) {
        deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  };

  this.clear = function() {
    _this.promise_chain = _this.promise_chain.then(function() {
      var deferred = Promise.pending();

      makeRequest('/custom/clear_collection', {}, false, _this.baseConfig).then(function(res) {
          deferred.resolve(res);
      });
      return deferred.promise;
    });
    return _this;
  }

  this.then = function(func) {
    _this.promise_chain.then(func);
    return _this;
  }

  return this;
}

module.exports = Collection
