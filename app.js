/*eslint-env node:true, node*/

var GET_ASTROS = "/astros";
var ASTROS_JSON = "public/data/astros.json";

var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();

// Serve static content from /public
app.use('/', express.static(__dirname + "/public"));

app.get(GET_ASTROS, /* @callback */ function(req, resp) {
	http.get("http://api.open-notify.org/astros.json", function(resp2) {
		var body = "";
		resp2.on("data", function(d) {
			body += d;
		});
		resp2.on("end", function() {
			resp.send(JSON.parse(body));
		});
	});
});

// GET the people in space (unused)
app.get(GET_ASTROS + "1", function (req, res) {
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

// listen for requests on the host at a port
var host = process.env.VCAP_APP_HOST || 'localhost';
var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port, host);