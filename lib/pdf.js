var fs = require('fs'),
    filetype = require("file-type"),
    request = require('request'),
    validUrl = require("valid-url"),
    Promise = require('bluebird');

// Backwards compatibility for array checking
if (typeof Array.isArray === 'undefined') {
  Array.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};

var handleString = function (pdf) {
  return new Promise(function (resolve, reject) {
    var input, options;
    if (validUrl.isWebUri(pdf)) {
      // File
      resolve({
        "pdf": pdf,
        "type": "url"
      });
    } else if (typeof pdf === 'string') {
      if (pdf.length <= 260 && fs.lstatSync(pdf).isFile()) {
        // File
        input = pdf;
        resolve({
          "pdf": input,
          "type": "file"
        });
      } else {
        // Base64 encoded pdf
        input = new Buffer(pdf, 'base64');
        resolve({
          "pdf": input,
          "type": "b64"
        });
      }
    } else {
      resolve(new Error(
        "Data input type must be url, filepath, or base64 encoded string"
      ));
    }
  });
}
var handlePdf = function (pdf) {
  return new Promise(function (resolve, reject) {
    handleString(pdf).then(function (output) {
      var input = output.pdf;
      var type = output.type;

      if (type === "url" || type === 'b64') {
        resolve(input);
      } else {
        // Type: file
        try {
          fs.readFile(input, function (err, pdf) {
            resolve(pdf.toString('base64'));
          });
        } catch (err) {
          reject(new Error("An unknown error while loading your pdf."));
        }
      }
    });
  });
}

module.exports = {
  preprocess: function (pdfs, batch) {
    return new Promise(function (resolve, reject) {
      // aggregate asynchronous results for batch reqs
      if (batch) {
        Promise.all(pdfs.map(function (pdf) {
          return handlePdf(pdf);
        })).then(function (data) {
          resolve(data);
        });
      } else {
        handlePdf(pdfs).then(function (b64) {
          resolve(b64);
        });
      }
    });
  }
}
