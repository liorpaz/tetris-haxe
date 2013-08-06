package view;

import js.Dom;

import util.JSUtil;

class Spacer
{

	var container:HtmlDom;

    public function new(width:Int, height:Int)
	{
		container = DocElements.getNewElement('div', "spacer");
		JSUtil.applyDimentions(container, width, height);
    }

	public function getView():HtmlDom
	{
		return container;
	}
}
