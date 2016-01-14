/*eslint-env node:true, node*/

var GET_ASTROS = "/astros";
<<<<<<< Upstream, based on 81368e494418a190251949ff91fe21e0c44b455a
var GET_TEST = "/test";
var ASTROS_JSON = "public/data/astros.json";

var fs = require('fs');
var Twitter = require('twitter');
var express = require('express');
var app = express();

var watson    = require('watson-developer-cloud');
var extend    = require('util')._extend;
function getServiceCreds(name) {
    if (process.env.VCAP_SERVICES) {
        var services = JSON.parse(process.env.VCAP_SERVICES);
        for (var service_name in services) {
            if (service_name.indexOf(name) === 0) {
                var service = services[service_name][0];
                return {
                    url: service.credentials.url,
                    username: service.credentials.username,
                    password: service.credentials.password
                };
            }
        }
    }
    return {};
}

var credentials = extend({
	version: 'v2-experimental',
	username: '<username>',
	password: '<password>'
}, getServiceCreds('tone_analyzer'));
var tone = watson.tone_analyzer(credentials);
console.log("******" + tone);

// Set up twitter client
var client;
fs.readFile(__dirname + '/keys.json', function(err, data) {
	if(err) {
		throw err;
	}
	var keys = JSON.parse(data);
	console.log("Keys loaded");
	client = new Twitter(keys['twitter']);
	//TODO - ensure client is created, check error
});

function getTimeLine (user, fn) {
	//TODO verify user is not null, does not start with @ etc.
	var params = {
		screen_name: user,
		count: 200
	};
	client.get('statuses/user_timeline', params, function(err, tweets, res){
		//TODO - handle error
		if (err) {
			console.log("**ERROR: " + user);
		} else {
			var tweets = tweets.map(function(x) {return x["text"];});
			var tweets = tweets.reduce(function (prev, curr) {return prev + "\n" + curr;}, "");
			//console.log(tweets);
			console.log("**SUCCESS: " + user);
			fn(tweets);
		}
	});
}


// Serve static content from /public
app.use('/', express.static(__dirname + "/public"));


// GET the people in space
app.get(GET_ASTROS, function (req, res) {
	res.sendfile(ASTROS_JSON);
});

// GET the people in space
app.get(GET_TEST, function (req, res) {
	//TODO - error case
	var screen_name = req.param('screen_name');
	//var screen_name = "realDonaldTrump";
	//var screen_name = "BarackObama";
	//TODO - check for null
	if (screen_name && screen_name.charAt(0) === "@") {
		screen_name = screen_name.substring(1);
	}
	//console.log("NAME=" + screen_name);
	getTimeLine(screen_name, function(tweets) {
		//res.send(tweets);
		tone.tone({text:tweets}, function(err, data) {
			if (err) {
				//TODO -error
				console.log("TONE_ERROR: " + screen_name + " " + err);
			} else {
				console.log("TONE_SUCCESS: " + screen_name + " ");
				res.json(data);
			}
		});
	});
});

// GET the people in space (unused)
app.get(GET_ASTROS + "2", function (req, res) {
	fs.readFile(ASTROS_JSON, "utf8", function (err, data) {
		if (err) {
			//TODO - send better error message
			res.send(err);
		} else {
			res.send(data);
		}
	});
});

/*
app.get('/', function (req, res) {
	res.sendfile('public/index.html');
});
*/

// listen for requests on the host at a port
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 3000);
=======
var ASTROS_JSON = "public/data/astros.json";

var fs = require('fs');
var express = require('express');
var app = express();

// Serve static content from /public
app.use('/', express.static(__dirname + "/public"));

// GET the people in space
app.get(GET_ASTROS, function (req, res) {
	res.sendfile(ASTROS_JSON);
});

// GET the people in space (unused)
app.get(GET_ASTROS + "2", function (req, res) {
	fs.readFile(ASTROS_JSON, "utf8", function (err, data) {
		if (err) {
			//TODO - send better error message
			res.send(err);
		} else {
			res.send(data);
		}
	});
});

/*
// GET the people the contents of a file (unused)
app.get('/', function (req, res) {
	res.sendfile('public/index.html');
});
*/

// listen for requests on the host at a port
var host = process.env.VCAP_APP_HOST || 'localhost';
var port = process.env.VCAP_APP_PORT || 3000;
>>>>>>> 128c521 Simple guys in space app
app.listen(port, host);