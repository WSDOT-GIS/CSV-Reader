﻿/*global define*/
/*jslint white:true,regexp:true*/
define(function () {

	"use strict";

	/** Creates a Regexp (regular expression) that will match CSV content.
	@param {String} [delimiter] The CSV field delimiter. Defaults to comma if omitted.
	*/
	function createRegexp(delimiter) {
		var objPattern;
		////// Check to see if the delimiter is defined. If not,
		////// then default to comma.
		////delimiter = (delimiter || ",");

		if (typeof delimiter !== "string") {
			throw new TypeError("The delimiter must be a string.");
		} else if (delimiter.length > 1) {
			throw new TypeError("The delimiter must contain at least one character.");
		}


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
		return objPattern;
	}

	/** Provides information about a match.
	@param {Array} match A regular expression match. The Regexp in question is one generated by the createRegexp function.
	@param {String} delimiter The delimiter string used with the createRegexp function.
	@property {String} value The value part of the match.  If the value was originally surrounded by quotes, the quotes will not be present here.
	@property {Boolean} isQuoted Indicates that value was originally surrounded by quotes.
	@property {Boolean} isNewLine Indicates if this is the start of a new row of data.
	*/
	function ValueInfo(match, delimiter) {
		var strMatchedDelimiter, strMatchedValue, isQuoted = false, isNewLine = false;
		// Get the delimiter that was found.
		strMatchedDelimiter = match[1];

		// Check to see if the given delimiter has a length (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know that this delimiter is a row delimiter.
		if (
			strMatchedDelimiter.length && (strMatchedDelimiter !== delimiter)) {
			// Since we have reached a new row of data, add an empty row to our data array.
			isNewLine = true;
		}


		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (match[2]) {

			isQuoted = true;

			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			strMatchedValue = match[2].replace(/""/g,'"');

		} else {

			// We found a non-quoted value.
			strMatchedValue = match[3];

		}

		this.value = strMatchedValue || null;
		this.isQuoted = isQuoted;
		this.isNewLine = isNewLine;
	}

	/** Creates a new object using data from an array.
	@param {Array} headers An array of strings that provide the property names.
	@param {Array} data This is the data that will be added to the object.
	@returns {Object}
	*/
	function createObjectFromData(headers, data) {
		var i, l, o = {};
		// Check to make sure that the length of the headers array is at least as large as that of the data.
		if (headers.length < data.length) {
			throw new RangeError("The headers array must have at least as many elements as the data array.");
		}

		// Add the corresponding value for each header. 
		// If there are more headers than data elements, the remaining headers will get a null value.
		for (i = 0, l = headers.length; i < l; i += 1) {
			o[headers[i]] = data.length > i ? data[i] : null;
		}

		return o;
	}

	/**
	This will parse a delimited string into an array of arrays. The default delimiter is the comma, but this
	can be overriden in the second argument.
	@param {String} csvData The CSV data
	@param {String} [delimiter] The CSV field delimiter. Defaults to comma if omitted.
	@returns {Array[]} An array of objects. Each object will have the same properties.
	@author http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
	*/
	function csvToObjects(csvData, delimiter) {
		var re, data, match, valueInfo, headers, objects = [];
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		delimiter = (delimiter || ",");

		// Create a regular expression to parse the CSV values.
		re = createRegexp(delimiter);

		// Create an array to hold our data. Give the array
		// a default empty first row.
		data = null; //[[]];

		// Create an array to hold our individual pattern
		// matching groups.
		match = null;


		match = re.exec(csvData);

		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (match) {
			valueInfo = new ValueInfo(match, delimiter);

			if (valueInfo.isNewLine) {
				if (!headers) {
					headers = data;
				} else {
					objects.push(createObjectFromData(headers, data));
				}
				data = []; // data.push([]);
			} else if (!data) {
				data = [];
			}

			// Now that we have our value string, let's add
			// it to the data array.
			data.push(valueInfo.value);
			match = re.exec(csvData);
		}

		// Return the parsed data.
		return objects;
	}

	/** Removes the last row from an array of arrays if it is empty.
	@param {Array} array An array containing other Arrays.
	*/
	function removeEmptyRow(array) {
		var lastRow;
		if (array && array.length) {
			lastRow = array[array.length - 1];
			/*jslint eqeq:true*/
			if ((!lastRow.length) || (lastRow.length === 1 && lastRow[0] == null)) { // The == (instead of ===) is intentional, checking for null AND undefined.
				array.pop();
			}
			/*jslint eqeq:false*/
		}
	}


	/**
	This will parse a delimited string into an array of arrays. The default delimiter is the comma, but this
	can be overriden in the second argument.
	@param {String} csvData The CSV data
	@param {String} [delimiter] The CSV field delimiter. Defaults to comma if omitted.
	@returns {String[][]}
	@author http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
	*/
	function csvToArray(csvData, delimiter) {
		var objPattern, arrData, arrMatches, valueInfo;
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		delimiter = (delimiter || ",");

		// Create a regular expression to parse the CSV values.
		objPattern = createRegexp(delimiter);

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
			valueInfo = new ValueInfo(arrMatches, delimiter);

			if (valueInfo.isNewLine) {
				arrData.push([]);
			}

			// Now that we have our value string, let's add
			// it to the data array.
			arrData[arrData.length - 1].push(valueInfo.value);
			arrMatches = objPattern.exec(csvData);
		}

		// Check the last line for an empty row.
		removeEmptyRow(arrData);

		// Return the parsed data.
		return (arrData);
	}

	return {
		toArray: csvToArray,
		toObjects: csvToObjects
	};

});