/*global define*/
/*jslint white:true*/
define(["esri/symbols/SimpleMarkerSymbol",
	"esri/renderers/SimpleRenderer"
], function (SimpleMarkerSymbol, SimpleRenderer) {
	"use strict";

	/** Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 * Function came from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	 * @param {number} min
	 * @param {number} max
	 * @returns {number}
	 */
	function getRandomInt(/**{number}*/ min, /**{number}*/ max) {
		/*jslint eqeq:true*/
		if (min == null) {
			min = 0;
		}
		if (max == null) {
			max = 0xffffff;
		}
		/*jslint eqeq:false*/

		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function createRandomPointRenderer() {
		var symbol, renderer, symbolStyles = ["circle", "square", "cross", "x", "diamond"];
		symbol = new SimpleMarkerSymbol();
		// Set the symbol to a randomly generated color.
		symbol.setColor(String(getRandomInt(0, 0xffffff)));
		symbol.setStyle(symbolStyles[getRandomInt(0, symbolStyles.length)]);
		renderer = new SimpleRenderer(symbol);

		return renderer;
	}

	return {
		getRandomInt: getRandomInt,
		createRandomPointRenderer: createRandomPointRenderer
	};
});