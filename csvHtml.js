/*global define*/
/*jslint browser:true, regexp:true*/

/** 
 * @module CSV-Reader/html
 */
define([
	"./main"
], function (CSV) {

	"use strict";

	/** @alias CSV-Reader/html */
	return {
		/** Converts a CSV string into an HTML table.
		 * @param {string} text A string of CSV text.
		 * @returns {HTMLTableElement} HTML table element.
		 * @static
		 */
		csvToHtmlTable: function (text) {
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
		},
		/** Converts objects into an HTML Table element.
		 * @param {Array<Object.<string, *>>} objects An array of objects.  Each object in the array should have the same field names.
		 * @returns {HTMLTableElement} HTML table element.
		 * @static
		 */
		objectsToHtmlTable: function (objects) {
			var headers, row, table, tr, td, i, l, header, j, jl;

			table = document.createElement("table");

			for (i = 0, l = objects.length; i < l; i += 1) {
				row = objects[i];
				// If this is the first time through, create an array of headers.
				if (i === 0) {
					headers = [];
					tr = document.createElement("tr");
					for (header in row) {
						if (row.hasOwnProperty(header)) {
							headers.push(header);
							td = document.createElement("th");
							td.textContent = header;
							tr.appendChild(td);
						}
					}
					table.appendChild(tr);
				}

				tr = document.createElement("tr");

				// Loop through each of the headers.  
				for (j = 0, jl = headers.length; j < jl; j += 1) {
					header = headers[j];
					td = document.createElement("td");
					td.textContent = row[header] || "";
					tr.appendChild(td);
				}

				table.appendChild(tr);
			}

			return table;
		}
	};

});