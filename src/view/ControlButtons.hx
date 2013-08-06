package view;

import util.Point;
import util.JSUtil;
import view.DocElements;
import js.JQuery;
import haxe.Timer;
import event.TouchEvent;
import view.Assets;
import view.ScreenLayouter;
import js.Lib;
import js.Dom;

class ControlButtons
{
	inline static var PADDING:Int = 15;
	inline static var CYCLE_BEFORE_REPEAT:Int = 8;

	var doc:Document;
	var _layout:Layout;
	var container:HtmlDom;
	var body:Dynamic;
	var buttonsState:ButtonsState;

	var leftButton:HtmlDom;
	var downButton:HtmlDom;
	var rightButton:HtmlDom;

	var _interactionLayout:Layout;
	var _rotateLayout:Layout;
	var leftLayout:Layout;
	var downLayout:Layout;
	var rightLayout:Layout;

	var _refreshRate:Int;
	var enabled:Bool = false;
	var timer:Timer;
	var counter:Int;

	var mainJQueryElement:JQuery;
	var controlJQueryElement:JQuery;
	var handleTouchStartRef:Dynamic->Void;
	var handleTouchEndRef:Dynamic->Void;
	var handleTouchMoveRef:Dynamic->Void;

	public var leftCallback:Void->Void;
	public var rightCallback:Void->Void;
	public var rotateCallback:Void->Void;
	public var downCallback:Void->Void;
	public var menuCallback:Void->Void;

    public function new(layout:Layout, interactionLayout:Layout,  refreshRate:Int=60)
	{
		doc = Lib.document;
		_layout = layout;
		_interactionLayout = interactionLayout;
		_refreshRate = refreshRate;
		buttonsState = new ButtonsState();
		timer = new Timer(refreshRate);
		timer.run = onTimerTick;
		createContainer();
		createButtons();
		mainJQueryElement = new JQuery(DocElements.mainNameHash);
		controlJQueryElement = new JQuery(DocElements.controlsNameHash);
		body = new JQuery(DocElements.body);
		addEventListeners();
	}

	function addEventListeners()
	{
		untyped __js__('$("body").bind("touchstart", function() {  });');
		handleTouchStartRef = handleTouchStart;
		handleTouchEndRef = handleTouchEnd;
		handleTouchMoveRef = handleTouchMove;
		if (JSUtil.isTouchDevice())
		{
			body.bind(TouchEvent.TOUCH_START, handleTouchStartRef);
			body.bind(TouchEvent.TOUCH_MOVE, handleTouchMoveRef);
			body.bind(TouchEvent.TOUCH_END, handleTouchEndRef);
		}
		else
		{
			JSUtil.addEventListener(doc, 'mouseDown', handleTouchStartRef);
			JSUtil.addEventListener(doc, 'mouseUp', handleTouchEndRef);
		}
	}

	function removeEventListeners()
	{
		if (JSUtil.isTouchDevice())
		{
			body.unbind(TouchEvent.TOUCH_START, handleTouchStartRef);
			body.unbind(TouchEvent.TOUCH_MOVE, handleTouchMoveRef);
			body.unbind(TouchEvent.TOUCH_END, handleTouchEndRef);
		}
		else
		{
			JSUtil.removeEventListener(doc, 'mouseDown', handleTouchStartRef);
			JSUtil.removeEventListener(doc, 'mouseUp', handleTouchEndRef);
		}
	}

	function onTimerTick()
	{
		buttonsState.incAll();
		doActions();
	}

	function doActions()
	{
		if (buttonsState.left == 1 || buttonsState.left > CYCLE_BEFORE_REPEAT)
		{
			leftCallback();
		}
		if (buttonsState.right == 1 || buttonsState.right > CYCLE_BEFORE_REPEAT)
		{
			rightCallback();
		}
		if (buttonsState.down == 1 || buttonsState.down > CYCLE_BEFORE_REPEAT)
		{
			downCallback();
		}
	}

	public function setEnabled(value:Bool)
	{
		if (enabled != value)
		{
			enabled = value;
			if (enabled)
			{
				timer = new Timer(_refreshRate);
				timer.run = onTimerTick;
			}
			else
			{
				timer.stop();
				timer = null;
			}
		}
	}

	function handleTouchMove(event:Dynamic)
	{
//		untyped __js__('alert("touchmove on body");');
		event.preventDefault();
		var firstTouch:Point = JSUtil.getFirstTouchPoint(event);
		firstTouch.y -= JSUtil.getPosition(container).y;

		if (leftLayout.inRect(firstTouch) && buttonsState.left == 0)
		{
			buttonsState.reset();
			buttonsState.left++;
			leftCallback();
		}
		else if (downLayout.inRect(firstTouch) && buttonsState.down == 0)
		{
			buttonsState.reset();
			buttonsState.down++;
			downCallback();
		}
		else if (rightLayout.inRect(firstTouch) && buttonsState.right == 0)
		{
			buttonsState.reset();
			buttonsState.right++;
			rightCallback();
		}
		else if (_interactionLayout.inRect(JSUtil.getFirstTouchPoint(event)))
		{
			buttonsState.reset();
		}
	}

	function handleTouchStart(event:Dynamic)
	{
		event.preventDefault();
		buttonsState.reset();

		var id:String = event.target.id;
		var firstTouch:Point = JSUtil.getFirstTouchPoint(event);
		firstTouch.y -= JSUtil.getPosition(container).y;

		var currentCount:Int;
//		DebugConsole.getInstance().log(firstTouch + '<br>', false);
		if (leftLayout.inRect(firstTouch))
		{
			currentCount = ++buttonsState.left;
			leftCallback();
		}
		else if (downLayout.inRect(firstTouch))
		{
			currentCount = ++buttonsState.down;
			downCallback();
		}
		else if (rightLayout.inRect(firstTouch))
		{
			currentCount = ++buttonsState.right;
			rightCallback();
		}

		if (_interactionLayout.inRect(JSUtil.getFirstTouchPoint(event)))
		{
			rotateCallback();
		}
	}

	function handleTouchEnd(event:Dynamic)
	{
		event.preventDefault();
		buttonsState.reset();

		var id:String = event.target.id;
		if (id == 'menuButton')
		{
			menuCallback();
		}
	}

	function createContainer()
	{
		container = DocElements.controlsContainer;
		var buttonsImage = Assets.cloudsButtons.createElement();
		container.appendChild(buttonsImage);
		JSUtil.setX(buttonsImage, Std.int((_layout.width - Assets.cloudsButtons.width) / 2));
		_layout.applyToElement(container);
	}

	function createButtons()
	{
		createButtonLayouts();

		leftButton = JSUtil.createButton("", "leftButton", leftLayout, "clearButton");
		container.appendChild(leftButton);
		downButton = JSUtil.createButton("", "downButton", downLayout, "clearButton");
		container.appendChild(downButton);
		rightButton = JSUtil.createButton("", "rightButton",rightLayout, "clearButton");
		container.appendChild(rightButton);

//		DebugConsole.getInstance().log("left = " + leftLayout.toString() + '<br>', false);
//		DebugConsole.getInstance().log("down = " + downLayout.toString() + '<br>', false);

	}

	function createButtonLayouts()
	{
		var buttonSize:Int = Assets.cloudsButtons.height + 10;
		var downX:Int = Std.int(_layout.x + _layout.width / 2 - buttonSize / 2);
		var leftX:Int = downX - buttonSize;
		var rightX:Int = downX + buttonSize;
		leftLayout = new Layout(leftX-buttonSize, 0, buttonSize*2, buttonSize);
		downLayout = new Layout(downX, 0, buttonSize, buttonSize);
		rightLayout = new Layout(rightX, 0, buttonSize*2, buttonSize);
	}
	function setAutoMargin(element:HtmlDom):HtmlDom
	{
		element.style.verticalAlign = 'bottom';
		return element;
	}
	public function getView():HtmlDom
	{
		return container;
	}
}

class ButtonsState
{
	public var left:Int = 0;
	public var right:Int = 0;
	public var down:Int = 0;
	public var rotate:Int = 0;

	public function new()
	{
	}

	public function reset()
	{
		left = right = down = rotate = 0;
	}

	public function incAll()
	{
		if (left > 0) left++;
		if (right > 0) right++;
		if (down > 0) down++;
		if (rotate > 0) rotate++;
	}

	public function toString():String
	{
		return left + " " + right + " " + down + " " + rotate;
	}
}
