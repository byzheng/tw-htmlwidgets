/*\
title: $:/plugins/bangyou/tw-leaflet/macro/leaflet.js
type: application/javascript
module-type: macro

Macro to return a formatted version of the current time

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "data-leaflet";

exports.params = [
	{para: "filter"}
];

/*
Run the macro
*/
exports.run = function(filter) {
	
	function isNumber(value) {
		return typeof value === 'number';
	}
	var tiddlers = $tw.wiki.filterTiddlers(filter);
	var markers_latitude = [];
	var markers_longitude = [];
	var markers_popup = [];
	for (let i=0; i<tiddlers.length; i++) {
		var tiddler = $tw.wiki.getTiddler(tiddlers[i]);
		if (tiddler === undefined) {
			continue;
		}
		if (tiddler.fields === undefined || tiddler.fields.point === undefined) {
			continue;
		}
		var points = tiddler.fields.point.split(',');
		if (points.length != 2) {
			continue;
		}
		var latitude_i = parseFloat(points[0]);
		var longitude_i = parseFloat(points[1]);

		if (!isNumber(longitude_i) || !isNumber(latitude_i)) {
			continue;
		}
		markers_longitude.push(longitude_i);
		markers_latitude.push(latitude_i);
		
		// Create popup
		var popup_i = "<h4><a href=\"#" + encodeURIComponent(tiddlers[i]) + "\">" + tiddlers[i] + "</a></h4>";
		markers_popup.push(popup_i);
	}
	var obj =  {"x":{"options":{"crs":{"crsClass":"L.CRS.EPSG3857","code":null,"proj4def":null,"projectedBounds":null,"options":{}}},"calls":[{"method":"addTiles","args":["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",null,null,{"minZoom":0,"maxZoom":18,"tileSize":256,"subdomains":"abc","errorTileUrl":"","tms":false,"noWrap":false,"zoomOffset":0,"zoomReverse":false,"opacity":1,"zIndex":1,"detectRetina":false,"attribution":"&copy; <a href='https://openstreetmap.org/copyright/'>OpenStreetMap<\/a>,  <a href='https://opendatacommons.org/licenses/odbl/'>ODbL<\/a>"}]},{"method":"addMarkers","args":[[42.0285,44.0285],[-93.65000000000001,-92.65000000000001],null,null,null,{"interactive":true,"draggable":false,"keyboard":true,"title":"","alt":"","zIndexOffset":0,"opacity":1,"riseOnHover":false,"riseOffset":250},null,null,null,null,null,{"interactive":false,"permanent":false,"direction":"auto","opacity":1,"offset":[0,0],"textsize":"10px","textOnly":false,"className":"","sticky":true},null]}],"limits":{"lat":[42.0285,44.0285],"lng":[-93.65000000000001,-92.65000000000001]}},"evals":[],"jsHooks":[]};

	obj.x.calls[1]["args"][0] = markers_latitude;
	obj.x.calls[1]["args"][1] = markers_longitude;
	obj.x.calls[1]["args"][6] = markers_popup;
	obj.x.limits.lat = [Math.min(...markers_latitude), Math.max(...markers_latitude)];
	obj.x.limits.lng = [Math.min(...markers_longitude), Math.max(...markers_longitude)];
	return JSON.stringify(obj);
};

})();