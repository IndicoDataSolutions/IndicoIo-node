var Promise = require('bluebird')
  , make_request = require('./services.js').make_request;

var Collection = function(collection, config) {
  var _this = this;
  
  this.collection = collection;
  if (typeof config !== 'undefined') {
    config['collection'] = collection
  }
  this.baseConfig = config || {'collection': collection};
  
  this.addData = function(data, config) {
    var batch = (typeof data[0] !== 'string') ? true : false;
    return make_request('/custom/add_data', data, batch, this.baseConfig);
  };

  this.removeExample = function(data, config) {
    var batch = (typeof data !== 'string') ? true : false;
    return make_request('/custom/remove_example', data, batch, this.baseConfig);
  }

  this.train = function() {
    return make_request('/custom/train', {}, false, this.baseConfig);
  };

  this.wait = function(status) {
    var deferred = Promise.pending();
    var waitForTrained = setInterval(function(){
      make_request('/custom/collections', {}, false).then(function(collectionList) {
        if (collectionList[_this.collection]['status'] !== 'training') {
          clearInterval(waitForTrained);
          deferred.resolve(collectionList[_this.collection]);
        }
      });
    }, 1000);
    return deferred.promise;
  };

  this.info = function() {
    return make_request('/custom/collections', {}, false).then(function(collectionList) {
      var status = collectionList[_this.collection];
      if (status !== undefined) {
        return status;
      } else {
        return {
          model_type: null,
          input_type: null,
          number_of_examples: 0,
          status: 'no examples'
        }
      }
    });
  }

  this.predict = function(data, config) {
    var batch = (typeof data !== 'string') ? true : false;
    return make_request('/custom/predict', data, batch, this.baseConfig);
  };

  this.clear = function(config) {
    return make_request('/custom/clear_collection', {}, false, this.baseConfig);
  }
}

module.exports = Collection
