/*\
title: $:/plugins/bangyou/tw-leaflet/filters/addgeojson.js
type: application/javascript
module-type: filteroperator

Add GeoJSON for leaflet

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.addgeojson = function(source,operator,options) {
	var results = [];
	var field = "text";
	if (operator.operand !== "") {
		field = operator.operand;
	}
	var geo_json = {};
	var data_tiddlers = [];
	source(function(tiddler,title) {
		if (tiddler === undefined || tiddler.fields === undefined) {
			return;
		}
		var t_text;
		if (field === "text") {
			t_text = $tw.wiki.getTiddlerText(title);
		} else {
			t_text = tiddler.fields[field];
		}
		if (t_text) {
			geo_json = JSON.parse(t_text);
		}
		data_tiddlers.push(title);
		return;
	});
	var obj =  {
                "method": "addGeoJSON",
                "args": [
                    geo_json,
                    null,
                    null,
                    {
                        "interactive": true,
                        "className": "",
                        "stroke": true,
                        "color": "#03F",
                        "weight": 5,
                        "opacity": 0.5,
                        "fill": true,
                        "fillColor": "#03F",
                        "fillOpacity": 0.2,
                        "smoothFactor": 1,
                        "noClip": false
                    }
                ],
							"tiddlers": data_tiddlers
            };
	results.push(JSON.stringify(obj));
	return results;
};

})();