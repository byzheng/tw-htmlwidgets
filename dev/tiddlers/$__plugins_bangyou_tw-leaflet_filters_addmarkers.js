/*\
title: $:/plugins/bangyou/tw-leaflet/filters/addmarkers.js
type: application/javascript
module-type: filteroperator

Add markers for leaflet

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	/*
	Export our filter function
	*/
	var utils = require("$:/plugins/bangyou/tw-htmlwidgets/utils.js").htmlwidgetsUtils;
	exports.addmarkers = function (source, operator, options) {
		// Check arguments
		var argValues = operator.operands;
		if (argValues.length === 1 && argValues[0] === "") {
			argValues = [];
		}
		var argNames = [];
		if (argValues.length > 0) {
			if (operator.suffixes === undefined || operator.suffixes.length == 0) {
				throw new Error('The variable values are provided. Please specify argument names, e.g. ' +
					'addmarkers:longitude,latitude:[longitude],[latitude]'
				);
			}
			if (operator.suffixes[0].length !== argValues.length) {
				throw new Error('Please specify argument names with the same length of variable values, e.g. ' +
					'addmarkers:longitude,latitude:[longitude],[latitude]'
				);
			}
			argNames = operator.suffixes[0];
		}

		var point_field = utils.getArgumentValue(argNames, argValues, "point", "point");
		var latitude_field = utils.getArgumentValue(argNames, argValues, "latitude", "latitude");
		var longitude_field = utils.getArgumentValue(argNames, argValues, "longitude", "longitude");
		var popup_tiddler = utils.getArgumentValue(argNames, argValues, "popup", null);
		if (!$tw.wiki.tiddlerExists(popup_tiddler)) {
			popup_tiddler = null;
		}

		var results = [];

		var markers_latitude = [];
		var markers_longitude = [];
		var markers_popup = [];
		var a = utils.isNumber(0);
		source(function (tiddler, title) {
			if (tiddler === undefined) {
				return;
			}
			if (tiddler.fields === undefined) {
				return;
			}
			var latitude_i;
			var longitude_i;

			// Use point as coordinates
			if (tiddler.fields[point_field] !== undefined) {
				var points = tiddler.fields[point_field].split(',');
				if (points.length != 2) {
					return;
				}
				latitude_i = points[0];
				longitude_i = points[1];
			}
			// Use longitude and latitude as coordinates
			if (tiddler.fields[point_field] === undefined &&
				tiddler.fields[latitude_field] !== undefined && tiddler.fields[longitude_field] !== undefined) {

				latitude_i = tiddler.fields[latitude_field];
				longitude_i = tiddler.fields[longitude_field];
			}

			// convert into int and check is a number
			latitude_i = parseFloat(latitude_i);
			longitude_i = parseFloat(longitude_i);
			if (!utils.isNumber(longitude_i) || !utils.isNumber(latitude_i)) {
				return;
			}

			markers_longitude.push(longitude_i);
			markers_latitude.push(latitude_i);
			// Create popup
			var popup_i;
			if (popup_tiddler === null) {
				popup_i = "<h4><a class=\"tiddler-link tc-tiddlylink tc-tiddlylink-resolves\" href=\"#" +
					encodeURIComponent(title) + "\"" +
					"data-to=\"" + title + "\"" +
					">" + title + "</a></h4>";
				if (tiddler.fields.text !== undefined && tiddler.fields.text !== "") {
					popup_i += "<p>" + tiddler.fields.text + "</p>";
				}
			} else {
				popup_i = $tw.wiki.renderTiddler("text/html", popup_tiddler,
					{ variables: { currentTiddler: title } }
				);
			}

			//var popup_i = "" + title + "";
			markers_popup.push(popup_i);
		});
		var rng_lat = [Math.min(...markers_latitude), Math.max(...markers_latitude)];
		var rng_lng = [Math.min(...markers_longitude), Math.max(...markers_longitude)];
		var obj = {
			"method": "addMarkers",
			"args": [
				markers_latitude,
				markers_longitude,
				null,
				null,
				null,
				{
					"interactive": true,
					"draggable": false,
					"keyboard": true,
					"title": "",
					"alt": "",
					"zIndexOffset": 0,
					"opacity": 1,
					"riseOnHover": false,
					"riseOffset": 250
				},
				markers_popup,
				null,
				null,
				null,
				null,
				{
					"interactive": false,
					"permanent": false,
					"direction": "auto",
					"opacity": 1,
					"offset": [
						0,
						0
					],
					"textsize": "10px",
					"textOnly": false,
					"className": "",
					"sticky": true
				},
				null
			],
			"limits": { "lat": rng_lat, "lng": rng_lng },
			"haslink": true
		};
		results.push(JSON.stringify(obj));
		return results;
	};

})();