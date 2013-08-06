package view;

import view.Box.Alignment;
import util.JSUtil;
import js.Dom;

class VBox extends Box
{
	var _fixedWidth:Int = 0;
	var _fixedHeight:Int = 0;

    public function new(id:String, className:String='', align:Alignment=null, position:String='absolute')
	{
		super(id, className, position);
		_align = align == null ? left : align;
    }

	override function doUpdate()
	{
		var children:HtmlCollection<HtmlDom> = container.childNodes;
		var lastY = spacingY;
		if (_fixedHeight > 0 && _valign == center)
		{
			lastY = Std.int((_fixedHeight - (JSUtil.sumChildrenHeight(container) + (children.length-1) * padding)) / 2);
		}
		var lastX = spacingX;
		var width = _fixedWidth > 0 ? _fixedWidth : JSUtil.getMaxWidth(container, fixedChildren) + spacingX;
		var height = 0;
		for (i in 0...children.length)
		{
			var child = children[i];
			var inFixedChildren = Lambda.indexOf(fixedChildren, child) > -1;
			if (inFixedChildren)
			{
				continue;
			}
			alignElement(child, width, lastY);
			var childHeight = JSUtil.getHeight(child);
			lastY += padding + childHeight;
			height += childHeight + padding;
		}

		if (height > 0) height -= padding;

		JSUtil.applyDimentions(container, _fixedWidth > 0 ? _fixedWidth : (width + spacingX),
		_fixedHeight > 0 ? _fixedHeight : (height + spacingY * 2));
	}

	function alignElement(element:HtmlDom, boxWidth:Int, y:Int)
	{
		var x = switch(_align)
		{
			case left:
				spacingX;
			case right:
				boxWidth - JSUtil.getWidth(element) - spacingX;
			case center:
				spacingX + Std.int((boxWidth - JSUtil.getWidth(element)) / 2);
			case bottom:
			case top:
		}
		JSUtil.setPosition(element, x, y);
	}

	public function setFixedWidth(value:Int)
	{
		_fixedWidth = value;
	}

	public function setFixedHeight(value:Int)
	{
		_fixedHeight = value;
	}
}