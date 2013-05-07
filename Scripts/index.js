/// <reference path="csv.js" />
/*global alert*/
/*jslint browser:true*/
(function () {
	"use strict";

	// Check for the various File API support.
	if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
		alert('The File APIs are not fully supported in this browser.');
		return;
	}

	////function parseCsv(/*String*/ csv, separator, delimiter) {
	////	var linesRe = /^.+$/mg;

	////	// Set default values if not provided.
	////	if (!separator) {
	////		separator = ",";
	////	}
	////	if (!delimiter) {
	////		delimiter = '"';
	////	}

	////	var match = csv.match(linesRe);
	////	console.debug(match);
	////}

	function handleFileLoad(evt) {
		var text = evt.target.result;
		// window.console.log(text);
		var csv = csvToArray(text, ',');
		console.log(csv);
	}

	function handleFileSelect(evt) {
		var file, files, reader;
		files = evt.target.files; // FileList object
		file = files[0];
		reader = new window.FileReader();
		reader.onload = handleFileLoad;

		reader.readAsText(file);
	}

	document.getElementById('file').addEventListener('change', handleFileSelect, false);
}());