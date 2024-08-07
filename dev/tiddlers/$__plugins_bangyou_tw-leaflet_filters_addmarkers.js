/*\
title: $:/plugins/bangyou/tw-leaflet/filters/addmarkers.js
type: application/javascript
module-type: filteroperator

Add markers for leaflet

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.addmarkers = function(source,operator,options) {
	var results = [];
	
	var markers_latitude = [];
	var markers_longitude = [];
	var markers_popup = [];
	function isNumber(value) {
		return typeof value === 'number';
	}
	source(function(tiddler,title) {
		if (tiddler === undefined) {
			return;
		}
		if (tiddler.fields === undefined || tiddler.fields.point === undefined) {
			return;
		}
		var points = tiddler.fields.point.split(',');
		if (points.length != 2) {
			return;
		}
		var latitude_i = parseFloat(points[0]);
		var longitude_i = parseFloat(points[1]);

		if (!isNumber(longitude_i) || !isNumber(latitude_i)) {
			return;
		}
		
		
		markers_longitude.push(longitude_i);
		markers_latitude.push(latitude_i);
		// Create popup
		var popup_i = "<h4><a class=\"tiddler-link tc-tiddlylink tc-tiddlylink-resolves\" href=\"#" + 
				encodeURIComponent(title) + "\"" + 
				"data-to=\"" + title + "\"" +
				">" + title + "</a></h4>";
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
              "limits": {"lat": rng_lat, "lng": rng_lng},
              "haslink": true
            };
	results.push(JSON.stringify(obj));
	return results;
};

})();