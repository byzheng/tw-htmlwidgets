/*\
title: $:/plugins/bangyou/tw-leaflet/filters/leaflet.js
type: application/javascript
module-type: filteroperator

leaflet map

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.leaflet = function(source,operator,options) {
	var results = [];
	// base object
	var base_obj =  {"x":{"options":{"crs":{"crsClass":"L.CRS.EPSG3857","code":null,"proj4def":null,"projectedBounds":null,"options":{}}},"calls":[]},"evals":[],"jsHooks":[]};
	var limits = {"lat": [-90, 90], "lng": [-180, 180]};
	var has_tiles = false;
	// add others into calls
	source(function(tiddler,title) {
		try {
			var call_i = JSON.parse(title);
			if (call_i.method !== undefined) {
				if (call_i.method === "addTiles") {
					has_tiles = true;
				}
				if (call_i.method === "setView") {
					base_obj.x.setView = call_i.args;
				} else {
					base_obj.x.calls.push(call_i);
				}
				// check limits
				if (call_i.limits !== undefined) {
					if (call_i.limits.lat[0] > limits.lat[0]) {
						limits.lat[0] = call_i.limits.lat[0];
					}
					if (call_i.limits.lat[1] < limits.lat[1]) {
						limits.lat[1] = call_i.limits.lat[1];
					}
					if (call_i.limits.lng[0] > limits.lng[0]) {
						limits.lng[0] = call_i.limits.lng[0];
					}
					if (call_i.limits.lng[1] < limits.lng[1]) {
						limits.lng[1] = call_i.limits.lng[1];
					}
				}
			}
		} catch (error) {
			console.error(error);
		};
	});
	if (!has_tiles) {
		var base_tiles = $tw.wiki.filterTiddlers("[addtiles[]]");
		base_obj.x.calls.push(JSON.parse(base_tiles));
	}
	base_obj.x.limits = limits;
	results.push(JSON.stringify(base_obj));
	return results;
};

})();