package view;

import util.JSUtil;
import util.JSUtil;
import js.Dom;

class SwitchBox extends Box
{
	var children:Array<HtmlDom>;
	var currentIndex:Int = -1;
	var _width:Int;
	var _height:Int;

	public function new(id:String, className:String, position:String='absolute')
	{
		super(id, className, position);
		children = [];
		_align = center;
		_valign = center;
	}

	public function setDimensions(width:Int, height:Int)
	{
		_width = width;
		_height = height;
		JSUtil.applyDimentions(container, width, height);
	}

	override public function add(child:HtmlDom)
	{
		var firstChild = children.length == 0;
		var h = 1;
		if (firstChild)
		{
			currentIndex = 0;
			h = JSUtil.getHeight(child);
		}
		JSUtil.setVisibility(child, false);
		children.push(child);
		container.appendChild(child);
		JSUtil.applyDimentions(container, _width, h);
		JSUtil.setVisibility(child, firstChild);
	}

	override function doUpdate()
	{
		alignElement(children[currentIndex], _width, 0);
	}

	function alignElement(element:HtmlDom, boxWidth:Int, y:Int)
	{
		var x = switch(_valign)
		{
			case left:
				spacingX;
			case center:
				spacingX + Std.int((boxWidth - JSUtil.getWidth(element)) / 2);
			case bottom:
			case right:
			case top:
		}
		JSUtil.setPosition(element, x, y);
	}


	public function setIndex(index:Int)
	{
		if (index != currentIndex)
		{
			JSUtil.setVisibility(children[currentIndex], false);
			JSUtil.setVisibility(children[index], true);
			currentIndex = index;
			JSUtil.applyDimentions(container, _width, JSUtil.getHeight(children[index]));
			alignElement(children[index], _width, 0);
		}
	}

	public function getIndex():Int
	{
		return currentIndex;
	}

	public function remove(child:HtmlDom)
	{
		children.remove(child);
		container.removeChild(child);
	}

	public function getNumChildren():Int
	{
		return children.length;
	}

}
