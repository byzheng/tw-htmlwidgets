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
	  this.viewtiddlers = [];
    try {
			this.parentDomNode = parent;
			this.computeAttributes();

			var type = this.getAttribute('type', '');
			const supported_types = ["echarts4r", "leaflet"];
			if (!supported_types.includes(type)) {
				throw new Error('Figure type is not supported');
			}

			var uuid = this.getAttribute('uuid', '');

			if (uuid === "") {
					uuid = (Math.random() + 1).toString(36).substring(3);
			}
			this.uuid = uuid;
			var containerDom = document.createElement('div');
			containerDom.id = uuid;
			containerDom.className = type  + " html-widget";
			containerDom.style.width = "100%";
			containerDom.style.height = "500px";   


			parent.insertBefore(containerDom, nextSibling);

			var text = this.getAttribute('data', '');
			if (text === "") {
				var filter = this.getAttribute('filter', '');
				if (filter === "") {
					 throw new Error('one of data or filter should be specified');
				}
				var tiddlers = this.wiki.filterTiddlers(filter, this);
				if (tiddlers.length !== 1) {
					 throw new Error('Only one item is expected');
				}
				text = tiddlers[0];
				
				var text_json = JSON.parse(text);
				for (let i = 0; i < text_json.x.calls.length; i++) {
					if (text_json.x.calls[i].tiddlers) {
						this.viewtiddlers.push(text_json.x.calls[i].tiddlers);
					}
				}
			}
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
		} catch (error) {
			console.error(error);
		};
};

	
/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
MyWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	var is_changed_tiddler = false;
	for (let i = 0; i < this.viewtiddlers.length; i++) {
		if (changedTiddlers[this.viewtiddlers[i]]) {
			is_changed_tiddler = true;
			break;
		}
	}
	if(changedAttributes.tiddler || changedAttributes.field || 
		 changedAttributes.index || changedAttributes.template || 
		 changedAttributes.format || is_changed_tiddler) {
		// destory old on
		if (this.uuid) {
			var element = document.getElementById(this.uuid);
			element.parentNode.removeChild(element);
		}
		this.refreshSelf();
		return true;
	} else {
		return false;
	}
};


exports.htmlwidgets= MyWidget;

})();