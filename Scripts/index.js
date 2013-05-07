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

	function csvToTextTable(/*String*/ text) {
		var csv, table, row, i, il, j, jl, tableElement;
		if (text) {

			csv = CSV.toArray(text, ',');

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


			tableElement = document.createElement("table");
			tableElement.innerHTML = table.join("");
		}
		return tableElement;
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
			tableElement = csvToTextTable(text);
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