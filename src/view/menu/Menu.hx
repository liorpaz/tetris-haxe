package view.menu;

import view.HBox;
import util.JSUtil;
import view.VBox;
import util.JSUtil;
import js.Lib;
import event.TouchEvent;

import feffects.Tween;
import feffects.easing.Cubic;

import js.Dom;

import util.JSUtil;
import util.AnimationUtil;

import view.DocElements;
import view.ScreenLayouter;

class Menu
{
	public inline static var PADDING:Int = 10;
	public inline static var V_SPACING:Int = 30;
	public inline static var COLOR1:Int = 0x3AE76F;
	public inline static var COLOR2:Int = 0xF5A308;
	public inline static var COLOR3:Int = 0xF5133F;
	public inline static var BUTTON_MARGINS:Int = 7;
	public inline static var BUTTON_TEXT_SIZE:Int = 27;
	public inline static var TITLE_FONT_SIZE:Int = 30;

	var container:VBox;
	var outerContainer:HBox;

	var _visible:Bool = false;
	public var menuWidth:Int = 200;
	public var menuHeight:Int = 300;
	var menuTargetX:Int;
	var menuTargetY:Int;
	var menuTween:Tween;

	var _buttonLayout:Layout;

	var removed:Bool = false; // this is a hack!!! memory leak!!!

	static var menuCounter:Int = 0;

	var touchCallbackRef:Event->Void;
	var _popupLayout:Layout;

	public function new(popupLayout:Layout)
	{
		_popupLayout = popupLayout;
		var buttonWidth = Std.int(popupLayout.width * 0.70);
		var buttonLeft = Std.int((popupLayout.width - buttonWidth) * 0.5);
		_buttonLayout = new Layout(buttonLeft, 0, buttonWidth, BUTTON_TEXT_SIZE + 2 * BUTTON_MARGINS);
		createMenu();
		addListeners();
	}

	function createMenu()
	{
		container = new VBox("menuContainer" + menuCounter++, "menu");
		JSUtil.setPosition(container.getView(), _popupLayout.x, _popupLayout.y);
		container.setFixedWidth(_popupLayout.width);
		container.setAlign(center);
		container.setPadding(PADDING);
		container.setSpacingY(V_SPACING);

		outerContainer = new HBox("outerMenuContainer" + menuCounter++, "");
		JSUtil.setPosition(outerContainer.getView(), _popupLayout.x, _popupLayout.y);
		outerContainer.setFixedHeight(_popupLayout.height);
		outerContainer.setAlign(top);
		outerContainer.addBox(container);
	}

	function addLabel(caption:String, fontSize:Int=-1, labelStyle:String='h1', fontColor:Int=-1)
	{
		if (fontSize == -1) fontSize = TITLE_FONT_SIZE;
		var id = StringTools.replace(caption, ' ', '_');
		var label:HtmlDom = JSUtil.createTextView(id, caption, JSUtil.cssPixels(fontSize), 0, 0, labelStyle);
		JSUtil.setWidth(label, _buttonLayout.width);
		if (fontColor > -1) label.style.color = JSUtil.cssHexColor(fontColor);
		return label;
	}

	function addSeparatorWithDots()
	{
		container.add(Assets.separatorWithDots.createElement());
	}

	function addSeparator()
	{
		container.add(Assets.separator.createElement());
	}

	public function close()
	{
		removeListeners();
		removed = true;
	}

	function finished()
	{
		menuTween = null;
		DocElements.mainElement.removeChild(outerContainer.getView());
	}

	function addListeners()
	{
		touchCallbackRef = touchCallback;
		untyped __js__('$("#menuContainer").bind("touchstart", function() { });');
		if (JSUtil.isTouchDevice())
		{
			JSUtil.addEventListener(Lib.document.body, TouchEvent.TOUCH_END, touchCallbackRef);
		}
		else
		{
			JSUtil.addEventListener(Lib.document.body, 'click', touchCallbackRef);
		}
	}

	function removeListeners()
	{
		if (JSUtil.isTouchDevice())
		{
			JSUtil.removeEventListener(Lib.document.body, TouchEvent.TOUCH_END, touchCallbackRef);
		}
		else
		{
			JSUtil.removeEventListener(Lib.document.body, 'click', touchCallbackRef);
		}
	}

	function touchCallback(event:Dynamic)
	{
		event.preventDefault();
	}

	public function getView():HtmlDom
	{
		return outerContainer.getView();
	}

	public function addedToDom()
	{
		outerContainer.update();
	}

}