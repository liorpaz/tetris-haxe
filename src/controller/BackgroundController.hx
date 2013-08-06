package controller;

import view.DocElements;

import util.JSUtil;
import js.Dom;
import view.Assets;
import js.Lib;
import view.ScreenLayouter;

class BackgroundController
{
	inline static var MAX_DARK_LAYER_ALPHA = 0.5;

	var _layout:Layout;
	var background:HtmlDom;
	var doc:Document;

	var darkLayer:HtmlDom;

	public function new(layout:Layout)
	{
		doc = Lib.document;
		_layout = layout;
		background = DocElements.getNewElement('div', 'boardBackground', 'boardBackground');
		layout.applyToElement(background);
		DocElements.mainElement.appendChild(background);

		darkLayer = DocElements.getNewElement('div', 'darkLayer');
		layout.applyToElement(darkLayer);
		darkLayer.style.backgroundColor = 'black';
		JSUtil.setOpacity(darkLayer, 0);
		DocElements.mainElement.appendChild(darkLayer);
	}

	public function update(value:Float)
	{
//		JSUtil.setOpacity(darkLayer, value * MAX_DARK_LAYER_ALPHA);
	}

}
