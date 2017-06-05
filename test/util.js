module.exports = {
  send: function(method, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method,
      params: params || [],
      id: new Date().getTime()
    }, callback);
  },

  sendPromise: function(method, params) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
          jsonrpc: '2.0',
          method,
          params: params || [],
          id: new Date().getTime()
        }, function(err,result) {
          if (err) {
            reject(err);
          }
          else {
            resolve(result);
          }
        });
    });
  }
}
