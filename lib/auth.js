var fs = require('fs'),
    process = require('process'),
    prompt = require('prompt');

var schema = {
    properties: {
    	username: {
    		required: true
    	},
    	password: {
            hidden: true,
            required: true
        }
    }
};

var query_auth = function () {
	if (!process.env.INDICO_EMAIL || !process.env.INDICO_PASSWORD) {
		var auth = read_auth();
		console.log(auth);
		if (auth.INDICO_EMAIL && auth.INDICO_PASSWORD) {
			process.env.INDICO_EMAIL = auth.INDICO_EMAIL; 
			process.env.INDICO_PASSWORD = auth.INDICO_PASSWORD;
			save_auth(auth);
		} else {
			prompt.start();
			prompt.get(schema, function (err, result) {
			    if (err) {
			    	console.log("Error entering username and password.")
			    } else {
			    	save_auth(result.username, result.password)
			    }
			});
		}
	} else {
		return {
			"INDICO_EMAIL": process.env.INDICO_EMAIL,
			"INDICO_PASSWORD": process.env.INDICO_PASSWORD 
		}
	}
}

var read_auth = function () {

	try {
	  var data = fs.readFileSync('./config.json');
	  return JSON.parse(data);
	} catch (err) {
	  return {
	    'INDICO_EMAIL': null,
	    'INDICO_PASSWORD': null
	  };
	}

}

var save_auth = function (username, password) {
	var data = {
		'INDICO_EMAIL': username,
		'INDICO_PASSWORD': password
	};
	process.env.INDICO_EMAIL = data.INDICO_EMAIL;
	process.env.INDICO_PASSWORD = data.INDICO_PASSWORD;
	fs.writeFile('./config.json', data, function (err) {
	    if (err) {
	        console.log('An error ocurred saving your auth credentials.');
	    }
	    console.log('Auth credentials saved.');
	});
}

exports.query_auth = query_auth;
