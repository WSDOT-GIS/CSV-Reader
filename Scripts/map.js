﻿/*global require*/
/*jslint browser:true*/
require([
	"csv/csvArcGis",
	"ui/layerList",
	"esri/map",
	"layerUtils",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/renderers/SimpleRenderer",
	"esri/InfoTemplate"
], function (csvArcGis, LayerList, Map, LayerUtils, SimpleMarkerSymbol, SimpleRenderer, InfoTemplate) {
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
		var text, graphicsLayer, symbol, renderer, infoTemplate, symbolStyles = ["circle", "square", "cross", "x", "diamond"];

		text = evt.target.result;

		try {
			graphicsLayer = csvArcGis.csvToGraphicsLayer(text, ',', null, null, null, null, null, {
				id: evt.target.file.name
			});

			renderer = LayerUtils.createRandomPointRenderer();
			infoTemplate = new InfoTemplate("Imported Feature", "${*}");

			graphicsLayer.setRenderer(renderer);
			graphicsLayer.setInfoTemplate(infoTemplate);

			map.addLayer(graphicsLayer);
		} catch (e) {
			if (e instanceof TypeError) {
				window.alert(e.message);
			} else {
				throw e;
			}
		}

		document.getElementById("file").value = null;
	}

	function handleFileSelect(evt) {
		var file, files, reader;
		files = evt.target.files; // FileList object
		file = files[0];
		reader = new window.FileReader();
		// Add the file as a property of the reader so its filename can be used as a layer id.
		reader.file = file;
		reader.onload = handleFileLoad;

		reader.readAsText(file);
	}

	document.getElementById('file').addEventListener('change', handleFileSelect, false);

});