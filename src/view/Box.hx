package view;

import util.JSUtil;
import haxe.Timer;
import util.JSUtil;
import js.Dom;

class Box
{
	var boxes:Array<Box>;

	var container:HtmlDom;
	var fixedChildren:Array<HtmlDom>;

	var spacingX:Int = 0;
	var spacingY:Int = 0;
	var padding:Int = 0;
	var _align:Alignment;
	var _valign:Alignment;
	var _halign:Alignment;

	public function new(id:String, className:String, position:String='absolute')
	{
		container = DocElements.getNewElement('div', id, className, position);
		fixedChildren = [];
		boxes = [];
	}

	public function getWidth():Int
	{
		return JSUtil.getWidth(container);
	}

	public function getHeight():Int
	{
		return JSUtil.getHeight(container);
	}

	public function add(child:HtmlDom)
	{
		container.appendChild(child);
		update();
	}

	public function addFixed(child:HtmlDom, x:Int, y:Int)
	{
		fixedChildren.push(child);
		JSUtil.setPosition(child, x, y);
		container.appendChild(child);
	}

	public function addBoxFixed(box:Box, x:Int, y:Int)
	{
		boxes.push(box);
		addFixed(box.getView(), x, y);
	}

	public function addBox(box:Box)
	{
		boxes.push(box);
		add(box.getView());
	}

	public function update()
	{
		for (i in 0...boxes.length)
		{
			boxes[i].update();
		}
		runAfter(doUpdate);
	}

	function doUpdate()
	{
	}

	public function setSpacingX(value:Int)
	{
		spacingX = value;
	}

	public function setSpacingY(value:Int)
	{
		spacingY = value;
	}

	public function setSpacing(value:Int)
	{
		spacingX = value;
		spacingY = value;
	}

	public function setPadding(value:Int)
	{
		padding = value;
	}

	public function getView():HtmlDom
	{
		return container;
	}

	public function setAlign(value:Alignment)
	{
		_align = value;
		update();
	}

	public function setVAlign(value:Alignment)
	{
		_valign = value;
		update();
	}

	public function setHAlign(value:Alignment)
	{
		_halign = value;
		update();
	}

	function runAfter(func:Void->Void)
	{
		var timer:Timer = new Timer(0);
		JSUtil.setOpacity(container, 0);
		timer.run = function()
		{
			timer.stop();
			func();
			JSUtil.setOpacity(container, 1);
		}
	}
}

enum Alignment
{
	left;
	right;
	center;
	top;
	bottom;
}
