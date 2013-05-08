/// <reference path="csv.js" />
/*global require */
/*jslint browser:true*/
require(["csv"], function (CSV) {
	"use strict";

	// Check for the various File API support.
	if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
		alert('The File APIs are not fully supported in this browser.');
		return;
	}


	

	function handleFileLoad(evt) {
		var text, tableElement, tableId;

		tableId = "csvTable";
		tableElement = document.getElementById(tableId);
		if (tableElement) {
			document.body.removeChild(tableElement);
		}

		text = evt.target.result;

		if (text) {
			tableElement = CSV.toHtmlTable(text);
			tableElement.id = tableId;
			document.body.appendChild(tableElement);
		}
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