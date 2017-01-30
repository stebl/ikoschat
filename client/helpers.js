var Client = require('node-rest-client').Client,
    suspend = require('suspend'),
    node_url = require('url');

helpers = function() {
  this.client = new Client();
};

helpers.prototype.get = function(url, callback) {
  var full_url = node_url.resolve(this.url, url);
  var req = this.client.get(full_url, function (data, response) {
    return callback(null, data);
  });

  req.on('error', function (err) {
    return callback(err);
  });
};

helpers.prototype.post = function(url, body, callback) {
  var full_url = node_url.resolve(this.url, url);
  var postargs = { data: body };
  var req = this.client.post(full_url, postargs, function (data, response) {
    return callback(null, data);
  });

  req.on('error', function (err) {
    return callback(err);
  });

}

module.exports = helpers;
