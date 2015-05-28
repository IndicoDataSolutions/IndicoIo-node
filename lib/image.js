var lwip = require('lwip'),
    Promise = require('bluebird');

var handleImage = function (image, size) {
    return new Promise(function (resolve, reject) {
        // Flatten the array for buffer loading
        var flattened = [];
        flattened = flattened.concat.apply(flattened, image);

        // Image reading and resizing
        lwip.open(new Buffer(flattened), {
             width: image.length
            ,height: image[0].length
        }, function (err, image) {
            image.resize(size, size, function (err, image) {
                image.toBuffer('png', function (err, buffer) {
                    resolve(buffer.toString("base64"));
                });
            });
        });
    });
}

module.exports = {
    preprocess : function (images, size, batch) {
        return new Promise(function (resolve, reject) {
            // aggregate asynchronous results for batch reqs
            if (batch) {
                var data = [];
                var count = 1;
                for (var j = 0; j < images.length; j++){
                    var final_j = j;
                    handleImage(images[j], size).then(function (b64) {
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
