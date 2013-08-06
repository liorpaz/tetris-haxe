package view;

import util.JSUtil;
import model.ShapeStore;
import js.Lib;
import js.Dom;

class BlockView
{
	public var _x:Int;
	public var _y:Int;
	public var _color:Int;
	public var _width:Int;
	public var _height:Int;

	var element:HtmlDom;

	public function new(x:Int, y:Int, color:Int, width:Int, height:Int)
	{
		_x = x;
		_y = y;
		_color = color;
		_width = width;
		_height = height;

		createBlock();
	}

	function createBlock()
	{
		element = Lib.document.createElement("div");
		element.className = 'block';
		element.style.backgroundColor = ShapeStore.getShapeColor(_color);
		element.style.position = 'absolute';
		element.style.left = JSUtil.cssPixels(_x * _width);
		element.style.top = JSUtil.cssPixels(_y * _height);
		element.style.width = JSUtil.cssPixels(_width - 2);
		element.style.height = JSUtil.cssPixels(_height - 2);
	}

	public function getView():HtmlDom
	{
		return element;
	}
}



