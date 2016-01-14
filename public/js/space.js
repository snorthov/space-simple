/*eslint-env browser */

var ROOT= location.protocol + "//" + location.host;
var GET_ASTROS = ROOT + "/astros";
var GET_TEST = ROOT + "/test";

var ASTRO_ID = "astros";
var TEST_ID = "test";

function main() {
	//startTimer();
	update();
}

function formatParams(params) {
	return "?" + Object.keys(params || "").map(function(key){
		return key+"="+encodeURIComponent(params[key]);
	}).join("&");
}

function showTone(i, astro, data) {
	//TODO - don't reach, check for errors
	var word_count = data.children[0].children.map(function(x) {return x["word_count"];});
	var total = word_count.reduce (function(p, n) {return p +n;}, 0);
	var percent = word_count.reverse();//.map(function (x) {return (x / total * 100).toFixed(1);});
	
	var node = document.getElementById(ASTRO_ID);
	var text = node.getElementById(astro.name + "-text");
	if (text) {
		text.textContent = astroString(astro, percent);
	}

	var circle = node.getElementById(astro.name + "-circle");
	if (circle) {
		circle.style.fill="blue";
	}
}

function showTone1(data) {
	var node = document.getElementById(TEST_ID);
	if (!node) return;
	//TODO - don't reach, check for errors
	var word_count = data.children[0].children.map(function(x) {return x["word_count"];});
	var total = word_count.reduce (function(p, n) {return p +n;}, 0);
	//TODO -divide by zero
	var z = data.children[0].children.map(function(x) {return [x["name"], (x["word_count"] / total * 100)];});
	var z2 = z.reverse().map(function(x) {return x[1];});
	z2[1] = z2[0] + z2[1];
	
	var bar = 
		'<div>' + z + '</div>' +
		'<div>' + z2 + '</div>' +
		'<svg width="200" height="15">' +
			'<defs>' +
				'<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">' +
					'<stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />' +
					'<stop offset="' + z2[0] + '%" style="stop-color:rgb(255,0,0);stop-opacity:1" />' +
					'<stop offset="' + z2[1] + '%" style="stop-color:rgb(0,255,0);stop-opacity:1" />' +
					'<stop offset="' + z2[2] + '%" style="stop-color:rgb(0,0,255);stop-opacity:1" />' +
					'<stop offset="100%" style="stop-color:rgb(0,0,255);stop-opacity:1" />' +
				'</linearGradient>' +
			'</defs>' +
			'<rect width="200" height="15" fill="url(#grad1)" />' +
		'</svg>';
	node.innerHTML = bar;
}

function mouseDown() {
	if (true) {
		var astro = "Donald Trump";
		var node = document.getElementById(ASTRO_ID);
		var item = node.getElementById(astro + "-text");
		alert (item);
		return;
	}
}

function updateTone(i, astro, fn) {
	var xhr = new XMLHttpRequest();
	var params = formatParams({screen_name : astro.twitter});
	xhr.open("GET", GET_TEST + params, true);
	xhr.responseType = "json";
	xhr.onload = function() {
		// success
		if (xhr.status === 200) {
			showTone(i, astro, xhr.response);
			if (fn) fn();
		}
	};
	xhr.onerror = function() {
		//TODO - handle errors
	};
	xhr.send();
}

function astroIcon(i, cy, astro) {
	cy += i * 30;
	var fill = astro.twitter ? "url(#busy)" : "#D63900";
	var icon =
		"<circle cx='100' cy='" + cy + "'' r='10' stroke='gray' stroke-width='3' fill='" + fill+ "'" + "id='" + astro.name + "-circle' >" + 
		"</circle>";
	return icon;
}

function astroString(astro, percent) {
	var name = astro.name, craft = astro.craft, twitter = astro.twitter;
	percent = percent || ["0", "0", "0"]; //(twitter ? ["?","?","?"] : ["n/a","n/a","n/a"]);
	var string = name + " (" + craft +")" + " - [anger: " + percent[0] + ", negative: " + percent[1] + ", cheerfulness: " + percent[2] + "]";
	return string;
}

function astroText(i, y, astro) {
	y += i * 30;
	var person =
		"<text x='120' y='" + y + "' fill='white' font-family='sans-serif' font-size='14'" + "id='" + astro.name + "-text' >" + 
			astroString(astro) +
		"</text>";
	return person;
}

function chain(i, astros) {
	if (i < astros.people.length) {
		if (astros.people[i].twitter) {
			updateTone(i, astros.people[i], function () {
				chain (i+1, astros);
			});
		} else {
			chain (i+1, astros);
		}
	}
}

function showAstros(astros) {
	var node = document.getElementById(ASTRO_ID);
	if (!node) return;
	var result = "", cy= 40, y = 43;
	for (var i=0; i<astros.people.length; i++) {
		var icon = astroIcon(i, cy, astros.people[i]);
		var person = astroText(i, y, astros.people[i]);
		result += icon + person;
	}
	node.innerHTML = result;
//	for (var i=0; i<astros.people.length; i++) {
//		if (astros.people[i].twitter) {
//			updateTone(i, astros.people[i]);
//		}
//	}
	chain (0, astros);
}

function update () {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", GET_ASTROS);
	xhr.responseType = "json";
	xhr.onload = function() {
		// success
		if (xhr.status === 200) {
			showAstros(xhr.response);
		}
	};
	xhr.onerror = function() {
		//TODO - handle errors
	};
	xhr.send();
}

var timer;
function startTimer () {
	if (timer) clearInterval(timer);
	timer = setInterval(function() {
		update();
	}, 1000);
}

function stopTimer() {
	if (timer) clearInterval(timer);
}