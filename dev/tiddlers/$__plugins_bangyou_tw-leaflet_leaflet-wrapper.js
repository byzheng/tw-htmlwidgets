/*\

htmlwidgets in tiddlywiki 5

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
if($tw.browser) {
var htmlwidges =require("$:/plugins/bangyou/tw-htmlwidgets/htmlwidgets-wrapper.js");
var jQuery = require("$:/plugins/bangyou/tw-leaflet/leaflet/jquery-1.12.4/jquery.min.js");


if(typeof window !== 'undefined' && typeof window.jQuery !== 'function') {
    window.jQuery = jQuery;
  }


var L = require("$:/plugins/bangyou/tw-leaflet/leaflet/leaflet-1.3.1/leaflet.js");
var proj4=require("$:/plugins/bangyou/tw-leaflet/leaflet/proj4-2.6.2/proj4.min.js");
var leaflet=require("$:/plugins/bangyou/tw-leaflet/leaflet/leaflet-binding-2.1.1/leaflet.js");


if(typeof window !== 'undefined' && typeof window.L !== 'function') {
    window.L = L;
  }


}

})();