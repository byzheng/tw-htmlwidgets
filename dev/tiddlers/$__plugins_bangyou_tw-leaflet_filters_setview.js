/*\
title: $:/plugins/bangyou/tw-leaflet/filters/setview.js
type: application/javascript
module-type: filteroperator

Set View for leaflet

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Export our filter function
*/
exports.setview = function(source,operator,options) {
	
	var para = operator.operands;
	if (para.length !== 3) {
		throw new Error('Require three parameters');
	}
	function isNumber(value) {
		return typeof value === 'number';
	}
	var lng = parseFloat(para[0]);
	var lat = parseFloat(para[1]);
	var view = parseFloat(para[2]);

	if (!isNumber(lng) || !isNumber(lat) || !isNumber(view)) {
		throw new Error('Require three numeric parameters');
	}
	var obj = {"method": "setView", "args": [[lat, lng], view, []]};
	var results = [];
	results.push(JSON.stringify(obj));
	return results;
};

})();