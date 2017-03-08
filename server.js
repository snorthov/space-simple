/*eslint-env node:true, node*/

var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();

var GET_ASTROS = "/astros";
var ASTROS_JSON = "public/astros.json";
var GET_ASTROS_OPEN_NOTIFY = "http://api.open-notify.org/astros.json";

// Serve static content from /public
app.use('/', express.static(__dirname + "/public"));

var count = 0;
function suffix(n) {
	return n === 0 ? "" : String(n);
}

// GET the people in space from the Open Notify API
app.get(GET_ASTROS + suffix(count++), /* @callback */ function(req, resp) {
	http.get(GET_ASTROS_OPEN_NOTIFY, function(resp2) {
		var body = "";
		resp2.on("data", function(data) {
			body += data;
		});
		resp2.on("end", function() {
			resp.send(JSON.parse(body));
		});
	});
});

// GET the people in space from a file (v )
app.get(GET_ASTROS + suffix(count++), /* @callback */ function (req, res) {
	res.sendfile(ASTROS_JSON);
});


// GET the people in space from a file (v2)
app.get(GET_ASTROS + suffix(count++), /* @callback */ function (req, res) {
	fs.readFile(ASTROS_JSON, "utf8", function (err, data) {
		if (err) {
			//TODO - send better error message
			res.send(err);
		} else {
			res.send(JSON.parse(data));
		}
	});
});

// listen for requests on the host at a port
var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
app.listen(port, function() {
	console.log('Server running on port: %d', port);
});