/*eslint-env browser */

var ROOT= location.protocol + "//" + location.host;
var GET_ASTROS = ROOT + "/astros";
var ASTRO_ID = "astros";

function main() {
	//startTimer();
	update();
}

function mouseDown(event) {
	alert ("mouseDown");
}

function showAstros(astros) {
	var node = document.getElementById(ASTRO_ID);
	if (!node) return;
	var result = "", cy= 40, y = 43;
	for (var i=0; i<astros.people.length; i++) {
		var astro = astros.people[i];
		var name = astro.name, craft = astro.craft;
		var icon = "<circle cx='100' cy='" + cy + "'' r='10' stroke='gray' stroke-width='3' fill='#D63900'>" + "</circle>";
		var person =  "<text x='120' y='" + y + "' fill='white' font-family='sans-serif' font-size='14'>" + name + " (" + craft +")" + "</text>";
		result += icon + person;
		cy += 30;
		y += 30;
	}
	node.innerHTML = result;
}

function params(params) {
	if (!params) params = {};
	return "?" + Object.keys(params || "").map(function(key){
		return key+"="+encodeURIComponent(params[key]);
	}).join("&");
}

function update () {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", GET_ASTROS + params({}), true);
	xhr.responseType = "json";
	xhr.onload = function() {
		// success
		if (xhr.status === 200) {
			showAstros(xhr.response);
		}
	};
	xhr.onerror = function() {
		// fail
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