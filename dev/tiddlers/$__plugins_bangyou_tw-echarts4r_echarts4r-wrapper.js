/*\

htmlwidgets in tiddlywiki 5

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
if($tw.browser) {
var htmlwidges =require("$:/plugins/bangyou/tw-htmlwidgets/htmlwidgets-wrapper.js");
var echarts =require("$:/plugins/bangyou/tw-echarts4r/echarts4r/echarts-en.min.js");
var ecstat=require("$:/plugins/bangyou/tw-echarts4r/echarts4r/ecStat.min.js");
/*var datatool=require("$:/plugins/bangyou/tw-htmlwidgets/echarts4r/dataTool.min.js");*/
var binding_echart=require("$:/plugins/bangyou/tw-echarts4r/echarts4r-binding/echarts4r.js");


if(typeof window !== 'undefined' && typeof window.echarts !== 'function') {
    window.echarts = echarts ;
  }
}

})();