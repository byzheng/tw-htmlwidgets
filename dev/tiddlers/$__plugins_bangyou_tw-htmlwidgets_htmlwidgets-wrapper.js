/*\

htmlwidgets in tiddlywiki 5

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

if($tw.browser) {
var htmlwidgets=require("$:/plugins/bangyou/tw-htmlwidgets/htmlwidgets/htmlwidgets.js");
}

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var MyWidget = function(parseTreeNode,options) {
    this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
MyWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
MyWidget.prototype.render = function(parent,nextSibling) {
    this.parentDomNode = parent;
    this.computeAttributes();

    var type = this.getAttribute('type', '');
    var uuid = this.getAttribute('uuid', '');
    var containerDom = document.createElement('div');
    containerDom.id = uuid;
    containerDom.className = type  + " html-widget";
    containerDom.style.width = "100%";
    containerDom.style.height = "500px";   
   

    parent.insertBefore(containerDom, nextSibling);

    var text = this.getAttribute('data', '');
    var containerScript= document.createElement('script');
    containerScript.type = "application/json";
    containerScript.dataset.for = uuid;   
    containerScript.innerHTML=text;
    parent.insertBefore(containerScript, nextSibling);

    var sizing = this.getAttribute('$sizing', '');
    var containerSizing = document.createElement('script');
    containerSizing.type = "application/htmlwidget-sizing";
    containerSizing.dataset.for = uuid;   
    containerSizing.innerHTML=sizing;
    parent.insertBefore(containerSizing, nextSibling);
window.HTMLWidgets.staticRender();
};


exports.htmlwidgets= MyWidget;

})();