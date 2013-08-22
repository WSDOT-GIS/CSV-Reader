/*global define*/
/*jslint white:true*/
define([
	"./main",
	"esri/graphic",
	"esri/layers/GraphicsLayer"
], function (CSV, Graphic, GraphicsLayer) {
	"use strict";

	/** Converts a value into a number (if it is not already).
	 * @param value
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
	 * @param {Object} object
	 * @param {string} xName
	 * @param {string} yName
	 * @param {Object} [spatialReference]
	 * @param {string} [zName]
	 * @param {string} [mName]
	 * @returns {esri/Graphic}
	 */
	function objectToPointFeature(object, xName, yName, spatialReference, zName, mName) {
		var feature, name;

		feature = {
			attributes: {},
			geometry: {
			}
		};


		// Loop through all of the properties of the object.
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

		feature = new Graphic(feature);

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
		 * @param {string} csv
		 * @param {string} delimiter
		 * @param {string} [xName] The field name that provides the X values. This can be omitted as long as the X field is named "X", "Long" or "Longitude" (case-insensitive).
		 * @param {string} [yName] The field name that provides the Y values.This can be omitted as long as the Y field is named "Y", "Lat" or "Latitude" (case-insensitive).
		 * @param {Object} [spatialReference] For values, see http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/
		 * @param {string} [zName]
		 * @param {string} [mName]
		 * @param {Function} [perObjectFunction] A function that is called for each object. This function should take a single parameter: the object parsed from a row of CSV data.
		 * @return {Array}
		 */
		csvToPointGraphics: function (csv, delimiter, xName, yName, spatialReference, zName, mName, perObjectFunction) {
			var objects, output = [], i, l, o, fieldNames;
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
				o = objectToPointFeature(objects[i], xName, yName, spatialReference, zName, mName);
				if (typeof perObjectFunction === "function") {
					perObjectFunction(o);
				}
				output.push(o);
			}

			return output;
		},
		/** Converts a CSV string into an array of point feature objects. (http://resources.arcgis.com/en/help/arcgis-rest-api/#/Feature_Object/02r3000000n8000000/)
		 * @param {string} csv
		 * @param {string} delimiter
		 * @param {string} [xName] The field name that provides the X values. This can be omitted as long as the X field is named "X", "Long" or "Longitude" (case-insensitive).
		 * @param {string} [yName] The field name that provides the Y values.This can be omitted as long as the Y field is named "Y", "Lat" or "Latitude" (case-insensitive).
		 * @param {Object} [spatialReference] For values, see http://resources.arcgis.com/en/help/arcgis-rest-api/#/Geometry_Objects/02r3000000n1000000/
		 * @param {string} [zName]
		 * @param {string} [mName]
		 * @param {Object} [graphicsLayerOptions] Options to pass to the GraphicsLayer constructor. See https://developers.arcgis.com/en/javascript/jsapi/graphicslayer-amd.html#graphicslayer2
		 * @return {esri/layers/GraphicsLayer}
		 */
		csvToGraphicsLayer: function (csv, delimiter, xName, yName, spatialReference, zName, mName, graphicsLayerOptions) {
			var graphicsLayer;

			graphicsLayer = new GraphicsLayer(graphicsLayerOptions);

			this.csvToPointGraphics(csv, delimiter, xName, yName, spatialReference, zName, mName, function (graphic) {
				graphicsLayer.add(graphic);
			});

			return graphicsLayer;
		}
	};
});