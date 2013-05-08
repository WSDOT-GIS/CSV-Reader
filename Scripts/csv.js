/*global define*/
/*jslint browser:true, regexp:true*/
define(function () {

	"use strict";
	/**
	This will parse a delimited string into an array of arrays. The default delimiter is the comma, but this
	can be overriden in the second argument.
	@param {String} csvData The CSV data
	@param {String} [delimiter] The CSV field delimiter. Defaults to comma if omitted.
	@returns {String[][]}
	@author http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
	*/
	function csvToArray(csvData, delimiter) {
		var objPattern, arrData, arrMatches, strMatchedDelimiter, strMatchedValue;
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		delimiter = (delimiter || ",");

		// Create a regular expression to parse the CSV values.
		//var re = /(\,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\,\r\n]*))/gi;
		objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + delimiter + "|\\r?\\n|\\r|^)" +

				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

				// Standard fields.
				"([^\"\\" + delimiter + "\\r\\n]*))"
			),
			"gi"
			);


		// Create an array to hold our data. Give the array
		// a default empty first row.
		arrData = [[]];

		// Create an array to hold our individual pattern
		// matching groups.
		arrMatches = null;


		arrMatches = objPattern.exec(csvData);

		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches) {

			// Get the delimiter that was found.
			strMatchedDelimiter = arrMatches[1];

			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				(strMatchedDelimiter !== delimiter)
				) {

				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push([]);

			}


			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[2]) {

				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				strMatchedValue = arrMatches[2].replace(
					new RegExp("\"\"", "g"),
					"\""
					);

			} else {

				// We found a non-quoted value.
				strMatchedValue = arrMatches[3];

			}


			// Now that we have our value string, let's add
			// it to the data array.
			arrData[arrData.length - 1].push(strMatchedValue);
			arrMatches = objPattern.exec(csvData);
		}

		// Return the parsed data.
		return (arrData);
	}

	// Alternate CSV parsing method.  It still needs work, as it simply skips blank entries, resulting in subsequent items being
	// placed in the wrong columns.
	/////** Converts a line from a CSV file into an array of strings.
	////@returns {String[]}
	////*/
	////function csvLineToArray(/*String*/ line) {
	////	var output = [], elementRe = /(?:("(?:[^"]|"{2})+"))|([^,]+)/gi, match, i, l, textContent = /^("?)(.+)\1$/i, element;
	////	elementRe = /(?:("(?:[^"]|"{2})+"))|([^,]+)|(,{2})/gi
	////	match = line.match(elementRe);

	////	for (i = 0, l = match.length; i < l; i += 1) {
	////		// Remove surrounding quotes (if applicable).
	////		element = match[i].match(textContent)[2];
	////		// Replace escapted quotes.
	////		element = element.replace(/"{2}/g, '"');
	////		output.push(element);
	////	}

	////	return output;
	////}

	/////** Converts a CSV table string into an array of arrays.
	////* @returns {String[][]}
	////*/
	////function csvToArray(/*String*/ csv) {
	////	var lineRe = /^.+$/gim, lines, output = [], i, l;
	////	/*string[]*/ lines = csv.match(lineRe);

	////	for (i = 0, l = lines.length; i < l; i += 1) {
	////		output.push(csvLineToArray(lines[i]));
	////	}

	////	return output;
		
	////}

	/**Converts a CSV string into an HTML table.
	@param {String} text A string of CSV text.
	@returns {Element} HTML table element.
	*/
	function csvToHtmlTable(/*String*/ text) {
		var csv, table, row, i, il, j, jl, tableElement, lastRow, header;
		if (text) {

			csv = csvToArray(text, ',');

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

	return {
		toArray: csvToArray,
		toHtmlTable: csvToHtmlTable
	};

});