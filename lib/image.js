var lwip = require('lwip'),
    fs = require('fs'),
    Promise = require('bluebird');


// Backwards compatibility for array checking
if (typeof Array.isArray === 'undefined') {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};

var handleImage = function (image, size, min_axis) {
    return new Promise(function (resolve, reject) {
        var input, options;
        if (Array.isArray(image)) {
            // Flatten the array for buffer loading
            var flattened = [];
            flattened = flattened.concat.apply(flattened, image);
            input = new Buffer(flattened);
            options = {
                  width: image.length
                , height: image[0].length
            };

            console.warn(
                "Image input as an array will be deprecated in the next major release"
            );
        } else if (typeof image === 'string') {
            if (image.length <= 260 && fs.lstatSync(image).isFile()) {
                input = image;
                var arr = image.split('.');
                options = arr[arr.length - 1]
            } else {
                input = new Buffer(image, 'base64');
                options = 'png';
            }
        } else {
            throw new Error(
                "Data input type must be array, filepath, or base64 encoded string"
            );
        }

        // Image reading and resizing
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
    });
}

module.exports = {
    preprocess : function (images, size, min_axis, batch) {
        return new Promise(function (resolve, reject) {
            // aggregate asynchronous results for batch reqs
            if (batch) {
                var data = [];
                var count = 1;
                for (var j = 0; j < images.length; j++){
                    var final_j = j;
                    handleImage(images[j], size, min_axis).then(function (b64) {
                        data[final_j] = b64;
                        if (count === images.length) {
                            resolve(data);
                        }
                        count++;
                    });
                }
            } else {
                handleImage(images, size).then(function (b64) {
                    resolve(b64);
                });
            }
        });
    }
}
