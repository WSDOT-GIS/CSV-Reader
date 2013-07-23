/*global define*/
/*jslint browser:true, regexp:true*/
define(["./csv"], function (CSV) {

	"use strict";

	/**Converts a CSV string into an HTML table.
	@param {String} text A string of CSV text.
	@returns {Element} HTML table element.
	*/
	function csvToHtmlTable(/*String*/ text) {
		var csv, table, row, i, il, j, jl, tableElement, lastRow, header;
		if (text) {

			csv = CSV.toArray(text, ',');

			table = [];

			for (i = 0, il = csv.length; i < il; i += 1) {
				row = csv[i];
				header = i === 0;
				lastRow = i === il - 1;
				if (header) {
					table.push("<thead>");
				} else if (i === 1) { // First non-header row.
					table.push("<tbody>");
				}

				table.push("<tr>");
				for (j = 0, jl = row.length; j < jl; j += 1) {
					table.push(i === 0 ? "<th>" : "<td>", row[j] || "", i === 0 ? "</th>" : "</td>");
				}
				table.push("</tr>");

				if (header) {
					table.push("</thead>");
				} else if (lastRow) {
					table.push("</tbody>");
				}
			}


			tableElement = document.createElement("table");
			tableElement.innerHTML = table.join("");
		}
		return tableElement;
	}

	///**
	//@param {Array} An array of objects.  Each object in the array should have the same field names.
	//*/
	//function objectsToHtmlTable(objects) {

	//}

	return {
		csvToHtmlTable: csvToHtmlTable
	};

});