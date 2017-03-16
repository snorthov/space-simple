/*eslint-env browser */

var ROOT= location.protocol + "//" + location.host;
var GET_ASTROS = ROOT + "/astros";
var CONTENTS_ID = "contents";

function main() {
	getAstros ();
}

function params(args) {
	if (!args) return "";
	return "?" + Object.keys(args || "").map(function(key) {
		return key + "="+  encodeURIComponent(args[key]);
	}).join("&");
}

function astroString(astro) {
	var string = astro.name + " (" + astro.craft +")";
	return string;
}

//TODO - refactor this function ... or maybe not ... how ugly is this code?
function getAstros(args) {
	var url = GET_ASTROS + params(args);
	var http = new XMLHttpRequest();
	http.open("GET", url);
	http.responseType = "json";
	http.onload = function() {
		if (http.status === 200) {
			var astros = http.response;
			var people = astros.people || [];
			var string = "";
			for (var i=0; i<people.length; i++) {
				string += "<div class='item'>";
				string +=
					"<div class='circle none' id='" + people[i].name + "-circle'></div>" +
					"<div class='text' id='" + people[i].name + "-text'>" + astroString(people[i]) + "</div>";
				string += "</div>";
			}
			var node = document.getElementById(CONTENTS_ID);
			if (node) node.innerHTML = string;
			return;
		}
		console.log(http.response);
	};
	http.onerror = function() {
		console.log(http.response);
	};
	http.send();
}