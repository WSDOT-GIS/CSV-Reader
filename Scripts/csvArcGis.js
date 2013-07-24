/*global require*/
/*jslint white:true*/
define(["csv"], function (CSV) {
	"use strict";

	/** Converts a value into a number (if it is not already).
	*/
	function getNumber(value) {
		var output;
		if (typeof value === "number") {
			output = value;
		} else if (typeof value === "string") {
			output = parseFloat(value);
		} else if (value) {
			output = Number(value);
		} else {
			output = null;
		}

		return output;
	}

	/** Converts an object into a point feature.
	@param {Object} object
	@param {String} delimiter
	@param {String} xName
	@param {String} yName
	@param {Object} [spatialReference]
	@param {String} [zName]
	@param {String} [mName]
	*/
	function objectToPointFeature(object, delimiter, xName, yName, spatialReference, zName, mName) {
		var feature, name;

		feature = {
			attributes: {},
			geometry: {
			}
		};


		for (name in object) {

			if (object.hasOwnProperty(name)) {
				if (name === xName) {
					feature.geometry.x = getNumber(object[xName]);
				} else if (name === yName) {
					feature.geometry.y = getNumber(object[yName]);
				} else if (zName && name === zName) {
					feature.geometry.z = getNumber(object[zName]);
				} else if (mName && name === mName) {
					feature.geometry.m = getNumber(object[mName]);
				} else {
					// Add the object property as an attribute of the feature.
					feature.attributes[name] = object[name];
				}
			}

		}

		if (spatialReference) {
			feature.geometry.spatialReference = spatialReference;
		}

		return feature;
	}

	/** Gets the likely X and Y field names from an object.
	*/
	function getXYFieldNames(/*{Object}*/ o) {
		var xRegex, yRegex, output, name;

		output = {
			xField: null,
			yField: null
		};

		xRegex = /x|(?:long(?:itude)?)/i;
		yRegex = /y|(?:lat(?:itude)?)/i;

		/*jslint forin:true*/
		for (name in o) {
			if (output.xField && output.yField) {
				break;
			}
			if (o.hasOwnProperty(name)) {
				if (xRegex.test(name)) {
					output.xField = name;
				} else if (yRegex.test(name)) {
					output.yField = name;
				}
			}
		}
		/*jslint forin:false*/

		return output;


	}

	return {
		/** Converts a CSV string into an array of point feature objects. (http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_Object/02r3000000n8000000/)
		@param {String} csv
		@param {String} delimiter
		@param {string} [xName] The field name that provides the X values. This can be omitted as long as the X field is named "X", "Long" or "Longitude" (case-insensitive).
		@param {string} [yName] The field name that provides the Y values.This can be omitted as long as the Y field is named "Y", "Lat" or "Latitude" (case-insensitive).
		@param {Object} [spatialReference] For values, see http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/
		@param {String} [zName]
		@param {String} [mName]
		@return {Array}
		*/
		csvToPointFeatures: function (csv, delimiter, xName, yName, spatialReference, zName, mName) {
			var objects, attributes, point, output = [], i, l, o, fieldNames;
			objects = CSV.toObjects(csv, delimiter);

			// If xName or yName were not provided, determine those values.
			if (!xName || !yName) {
				fieldNames = getXYFieldNames(objects[0]);
				xName = xName || fieldNames.xField;
				yName = yName || fieldNames.yField;
			}

			if (!xName || !yName) {
				throw new TypeError("Either the xName or yName were not provided and could not be determined automatically.");
			}

			for (i = 0, l = objects.length; i < l; i += 1) {
				o = objectToPointFeature(objects[i], delimiter, xName, yName, spatialReference, zName, mName);
				output.push(o);
			}

			return output;
		}
	};
});