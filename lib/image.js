var fs = require('fs'),
    filetype = require("file-type"),
    request = require('request'),
    validUrl = require("valid-url"),
    Promise = require('bluebird');

try {
  lwip = require('lwip')
} catch (err) {
  lwip = null;
}

// Backwards compatibility for array checking
if (typeof Array.isArray === 'undefined') {
  Array.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};

var handleString = function (image) {
  return new Promise(function (resolve, reject) {
    var input, options;
    if (validUrl.isWebUri(image)) {
      resolve({
        "image": image,
        "type": "url"
      });
    } else if (typeof image === 'string') {
      if (image.length <= 260 && fs.lstatSync(image).isFile()) {
        input = image;
        var arr = image.split('.');
        options = arr[arr.length - 1];
        resolve({
          "image": input,
          "options": options,
        });
      } else {
        input = new Buffer(image, 'base64');
        options = filetype(input).ext;
        resolve({
          "image": input,
          "options": options,
        });
      }
    } else {
      resolve(new Error(
        "Data input type must be array, filepath, or base64 encoded string"
      ));
    }
  });
}
var handleImage = function (image, size, min_axis) {
  return new Promise(function (resolve, reject) {
    handleString(image).then(function (output) {
      var input = output.image;
      var options = output.options;
      var type = output.type;

      if (type === "url") {
        resolve(input);
      } else {
        // Image reading and resizing
        if (!lwip) {
          reject(new Error(
            "Image processing dependency LWIP could not be loaded."
          ))
        }
        try {
          lwip.open(input, options, function (err, image) {
            var ratio = image.width() / image.height();
            if (ratio >= 10 || ratio <= .1)
              console.warn(
                "For best performance, we recommend using images of aspect ratio less than 1:10."
              );

            if (size) {
              var new_height = size,
                  new_width = size;

              if (min_axis) {
                new_height = ratio > 1 ? 1 / ratio * size : size;
                new_width = ratio > 1 ? size : ratio * size;
              }
              image.resize(new_width, new_height, function (err, image) {
                image.toBuffer('png', function (err, buffer) {
                  resolve(buffer.toString("base64"));
                });
              });
            } else {
              image.toBuffer('png', function (err, buffer) {
                resolve(buffer.toString("base64"));
              });
            }
          });
        } catch (err) {
          reject(new Error("An unknown error while loading your image."));
        }
      }
    });
  });
}

module.exports = {
  preprocess: function (images, size, min_axis, batch) {
    return new Promise(function (resolve, reject) {
      // aggregate asynchronous results for batch reqs
      if (batch) {
        Promise.all(images.map(function (image) {
          return handleImage(image, size, min_axis);
        })).then(function (data) {
          resolve(data);
        });
      } else {
        handleImage(images, size).then(function (b64) {
          resolve(b64);
        });
      }
    });
  }
}
