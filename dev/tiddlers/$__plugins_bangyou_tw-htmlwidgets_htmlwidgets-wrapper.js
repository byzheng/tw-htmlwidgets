/*\

htmlwidgets in tiddlywiki 5

\*/
(function () {

	/*jslint node: true, browser: true */
	/*global $tw: false */
	"use strict";

	if ($tw.browser) {
		var htmlwidgets = require("$:/plugins/bangyou/tw-htmlwidgets/htmlwidgets/htmlwidgets.js");
	}

	var Widget = require("$:/core/modules/widgets/widget.js").widget;

	var MyWidget = function (parseTreeNode, options) {
		this.initialise(parseTreeNode, options);
	};

	/*
	Inherit from the base widget class
	*/
	MyWidget.prototype = new Widget();

	/*
	Render this widget into the DOM
	*/
	MyWidget.prototype.render = function (parent, nextSibling) {
		// Tiddlers to obtain data
		this.viewtiddlers = [];

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
		containerDom.className = type + " html-widget";
		containerDom.style.width = "100%";
		containerDom.style.height = "500px";


		parent.insertBefore(containerDom, nextSibling);
		try {
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


				var haslink = false;
				var text_json = JSON.parse(text);
				for (let i = 0; i < text_json.x.calls.length; i++) {
					// get all tiddlers to obtain data
					if (text_json.x.calls[i].tiddlers) {
						this.viewtiddlers.push(text_json.x.calls[i].tiddlers);
					}
					// Check whether has link to render 
					if (text_json.x.calls[i].haslink) {
						haslink = true;
					}
				}
				if (haslink) {
					// Only for links in figures: Open in story river 
					var tiddlerTitle = this.getAttribute("tiddler", this.getVariable("currentTiddler"));
					text_json.jsHooks = {
						"render": [{
							"code": "function(el, x, data) {\n" +
								"  return (\n" +
								"      function(el, x) {\n" +
								"            var openLinkFromInsideRiver = $tw.wiki.getTiddler('$:/config/Navigation/openLinkFromInsideRiver').fields.text;\n" +
								"          var openLinkFromOutsideRiver=$tw.wiki.getTiddler('$:/config/Navigation/openLinkFromOutsideRiver').fields.text;\n" +
								"          var the_story = new $tw.Story({wiki: $tw.wiki});\n" +
								"      var map = this;\n" +
								"      function opentiddler(event){\n" +
								"        event.preventDefault();\n" +
								"        var element = event.target;\n" +
								"        var navigateto = element.dataset.to;\n" +
								"        //alert(navigateto);\n" +
								"        the_story.addToStory(navigateto, '" + tiddlerTitle + "', {\n" +
								"            openLinkFromInsideRiver: openLinkFromInsideRiver,\n" +
								"            openLinkFromOutsideRiver: openLinkFromOutsideRiver\n" +
								"        });\n" +
								"        the_story.addToHistory(navigateto);\n" +
								"        \n" +
								"        \n" +
								"      }\n" +
								"      //if ($tw !== undefined) {\n" +
								"      // alert('AAAAAAA');\n" +
								"      //}\n" +
								"      \n" +
								"      let eventHandlerAssigned = false;\n" +
								"      map.on('popupopen', function(){\n" +
								"          if (!eventHandlerAssigned && document.querySelector('.tiddler-link')){\n" +
								"            const links = document.querySelectorAll('.tiddler-link');\n" +
								"            for (var i = 0; i < links.length; i++) {\n" +
								"                links[i].addEventListener('click', opentiddler);\n" +
								"            }\n" +
								"            \n" +
								"            eventHandlerAssigned = true;\n" +
								"          }\n" +
								"        })\n" +
								"      map.on('popupclose', function(){\n" +
								"          const links = document.querySelectorAll('.tiddler-link');\n" +
								"          for (var i = 0; i < links.length; i++) {\n" +
								"            links[i].removeEventListener('click', opentiddler);\n" +
								"          }\n" +
								"           eventHandlerAssigned = false\n" +
								"        })\n" +
								"    }).call(this.getMap(), el, x, data);" +
								"\n}",
							"data": null
						}]
					};
					text = JSON.stringify(text_json);
				}
			}
			var containerScript = document.createElement('script');
			containerScript.type = "application/json";
			containerScript.dataset.for = uuid;
			containerScript.innerHTML = text;
			parent.insertBefore(containerScript, nextSibling);

			var sizing = this.getAttribute('$sizing', '');
			var containerSizing = document.createElement('script');
			containerSizing.type = "application/htmlwidget-sizing";
			containerSizing.dataset.for = uuid;
			containerSizing.innerHTML = sizing;
			parent.insertBefore(containerSizing, nextSibling);
			window.HTMLWidgets.staticRender();
		} catch (error) {
			parent.innerHTML = error;
			console.error(error);
		};
	};


	/*
	Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
	*/
	MyWidget.prototype.refresh = function (changedTiddlers) {
		var changedAttributes = this.computeAttributes();
		var is_changed_tiddler = false;
		for (let i = 0; i < this.viewtiddlers.length; i++) {
			if (changedTiddlers[this.viewtiddlers[i]]) {
				is_changed_tiddler = true;
				break;
			}
		}
		if (changedAttributes.tiddler || changedAttributes.field ||
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


	exports.htmlwidgets = MyWidget;

})();