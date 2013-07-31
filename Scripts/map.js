/*global require*/
/*jslint browser:true*/
require([
	"csv/csvArcGis",
	"csv/layerList",
	"esri/map",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/renderers/SimpleRenderer",
	"esri/InfoTemplate"
], function (csvArcGis, LayerList, Map, SimpleMarkerSymbol, SimpleRenderer, InfoTemplate) {
	"use strict";

	var map, layerList;

	// Check for the various File API support.
	if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
		window.alert('The File APIs are not fully supported in this browser.');
		return;
	}

	map = new Map("map", {
		basemap: "gray",
		center: [-120.80566406246835, 47.41322033015946],
		zoom: 7,
		showAttribution: true
	});

	layerList = new LayerList(map, "layerList");

	function handleFileLoad(evt) {
		var text, graphicsLayer, symbol, renderer, infoTemplate;

		console.debug(evt);

		text = evt.target.result;

		graphicsLayer = csvArcGis.csvToGraphicsLayer(text, ',', null, null, null, null, null, {
			id: ["imported_from_csv", Date.now()].join("_")
		});

		symbol = new SimpleMarkerSymbol();
		renderer = new SimpleRenderer(symbol);
		infoTemplate = new InfoTemplate("Imported Feature", "${*}");

		graphicsLayer.setRenderer(renderer);
		graphicsLayer.setInfoTemplate(infoTemplate);

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