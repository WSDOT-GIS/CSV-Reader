/*global define*/
/*jslint browser:true*/
define(["dojo/_base/declare", "dojo/Evented"], function (declare, Evented) {
	/**
	 * @exports layerList
	 */
	"use strict";
	var LayerList, LayerListItem;

	/** @class
	 */
	LayerListItem = declare([Evented], {
		domNode: null,
		checkbox: null,
		label: null,
		layer: null,
		/** @constructs */
		constructor: function (layer) {
			var self = this;
			this.layer = layer;
			this.domNode = document.createElement("li");
			this.domNode.setAttribute("data-layer-id", layer.id);
			this.checkbox = document.createElement("input");
			this.checkbox.type = "checkbox";
			this.checkbox.id = ["layer", layer.id].join("_");
			this.checkbox.checked = layer.visible;
			this.domNode.appendChild(this.checkbox);
			this.label = document.createElement("label");
			this.label.textContent = layer.id;
			this.label.htmlFor = this.checkbox.id;
			this.domNode.appendChild(this.label);

			this.checkbox.addEventListener("click", function () {
				if (this.checked) {
					self.layer.show();
				} else {
					self.layer.hide();
				}
			});
		}
	});

	/** @class
	 */
	LayerList = declare(Evented, {
		domNode: null,
		/** @constructs */
		constructor: function (map, domNode) {
			var graphicsLayerList;

			if (!domNode) {
				this.domNode = document.createElement("div");
			} else if (typeof domNode === "string") {
				domNode = document.getElementById(domNode);
				this.domNode = domNode;
			} else if (domNode instanceof window.HTMLElement) {
				this.domNode = domNode;
			} else {
				throw new TypeError("Invalid domNode type.");
			}

			graphicsLayerList = document.createElement("ul");
			domNode.appendChild(graphicsLayerList);

			map.on("layer-add-result", function (e, error) {
				var layer = e.layer, layerListItem;
				if (e && e.layer && !error) {
					layerListItem = new LayerListItem(layer);
					graphicsLayerList.appendChild(layerListItem.domNode);
				}
			});

			map.on("layer-remove", function (e) {
				////throw new Error("Not implemented");
			});
		}
	});

	return LayerList;
});