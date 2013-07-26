/*global require*/
require([
	"csv/csvArcGis",
	"esri/map",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/renderers/SimpleRenderer"
], function (csvArcGis, Map, SimpleMarkerSymbol, SimpleRenderer) {
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
		var text, graphicsLayer, symbol, renderer;

		text = evt.target.result;

		graphicsLayer = csvArcGis.csvToGraphicsLayer(text, ',', null, null, null, null, null, {
			id: "imported_from_csv"
		});

		symbol = new SimpleMarkerSymbol();
		renderer = new SimpleRenderer(symbol);

		graphicsLayer.setRenderer(renderer);

		map.addLayer(graphicsLayer);

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