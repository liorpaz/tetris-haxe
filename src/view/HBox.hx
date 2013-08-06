package view;

import view.Box.Alignment;
import util.JSUtil;
import js.Dom;

class HBox extends Box
{
	var _fixedHeight:Int = 0;

	public function new(id:String, className:String, position:String='absolute')
	{
		super(id, className, position);
		_align = bottom;
	}

	override function doUpdate()
	{
		var lastY = spacingY;
		var lastX = spacingX;
		var children:HtmlCollection<HtmlDom> = container.childNodes;
		var width = 0;
		var height = _fixedHeight > 0 ? _fixedHeight : calculateHeight();

		for (i in 0...children.length)
		{
			var child = children[i];
			var inFixedChildren = Lambda.indexOf(fixedChildren, child) > -1;
			if (inFixedChildren)
			{
				continue;
			}
			alignElement(child, lastX, height + spacingY * 2);
			var childWidth = JSUtil.getWidth(child);
			lastX += padding + childWidth;
			width += childWidth + padding;
		}

		if (height > 0) height += padding;

		JSUtil.applyDimentions(container, width + spacingX * 2 , height + spacingY * 2);
	}

	function alignElement(element:HtmlDom, x:Int, boxHeight:Int)
	{
		var y = switch(_align)
		{
			case center:
				spacingY + Std.int((boxHeight - JSUtil.getHeight(element)) / 2);
			case bottom:
				boxHeight - spacingY - JSUtil.getHeight(element);
			case top:
				spacingY;
			case left:
			case right:

		}
		JSUtil.setPosition(element, x, y);
	}

	function calculateHeight():Int
	{
		var children:HtmlCollection<HtmlDom> = container.childNodes;
		var height = 0;
		for (i in 0...children.length)
		{
			height = Std.int(Math.max(height, JSUtil.getHeight(children[i])));
		}
		return height;
	}

	public function setFixedHeight(value:Int)
	{
		_fixedHeight = value;
	}
}
