/*global require*/
require(["csv/csvArcGis", "esri/map"], function (csvArcGis, Map) {
	"use strict";

	var map;

	// Check for the various File API support.
	if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
		alert('The File APIs are not fully supported in this browser.');
		return;
	}

	map = new Map("map", {
		basemap: "gray",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 7,
		showAttribution: true
	});

	function handleFileLoad(evt) {
		var text, features;

		text = evt.target.result;

		features = csvArcGis.csvToPointFeatures(text);

		console.log(features);

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

});