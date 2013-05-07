/// <reference path="csv.js" />
/*global alert, csvToArray */
/*jslint browser:true*/
(function () {
	"use strict";

	// Check for the various File API support.
	if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
		alert('The File APIs are not fully supported in this browser.');
		return;
	}

	function handleFileLoad(evt) {
		var text, csv, table, row, i, il, j, jl, tableElement;
		text = evt.target.result;
		csv = csvToArray(text, ',');
		
		table = [];

		for (i = 0, il = csv.length; i < il; i += 1) {
			row = csv[i];
			if (i === 0) {
				table.push("<thead>");
			} else if (i === 1) {
				table.push("<tbody>");
			}

			table.push("<tr>");
			for (j = 0, jl = row.length; j < jl; j += 1) {
				table.push(i === 0 ? "<th>" : "<td>", row[j] || "", i === 0 ? "</th>" : "</td>");
			}
			table.push("</tr>");

			if (i === 0) {
				table.push("</thead>");
			} else if (i === 1) {
				table.push("</tbody>");
			}
		}

		tableElement = document.getElementsByTagName("table");
		if (tableElement && tableElement.length) {
			document.body.removeChild(tableElement[0]);
		}

		tableElement = document.createElement("table");
		tableElement.innerHTML = table.join("");

		document.body.appendChild(tableElement);
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