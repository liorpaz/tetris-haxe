package view;

import util.Point;
import util.JSUtil;
import util.JSUtil;
import js.Lib;
import js.Dom;

class ScreenLayouter
{
	static inline var BOARD_WIDTH_TO_WINDOW_WIDTH:Float = 0.77;
	static inline var BOARD_HEIGHT_TO_WINDOW_HEIGHT:Float = 0.77;
	static inline var SUGGESTED_CONTROLS_HEIGHT:Int = 80;
	static inline var NOTIFICATION_HEIGHT:Int = 30;
	static inline var METER_WIDTH:Int = 6;
	static inline var PANEL_WIDTH:Int = 50;
	static inline var PANEL_PADDING:Int = 3;
	static inline var BOARD_AND_BUTTONS_OVERLAP:Int = 6;

	var boardAspectRatio:Float;
	var doc:Document;
	var window:Window;

	var winW:Float = 0;//630;
	var winH:Float = 0;//460;
	var _modelWidth:Int;
	var _modelHeight:Int;

	public var menuLayout:Layout;
	public var boardLayout:Layout;
	public var controlsLayout:Layout;
	public var opponentMeterLayout:Layout;
	public var panelLayout:Layout;
	public var leftPanelLayout:Layout;
	public var backgroundLayout:Layout;
	public var screenLayout:Layout;
	public var notificationLayout:Layout;

	var canvas:Dynamic;

	public function new(boardAspectRatio:Float, modelWidth:Int, modelHeight:Int)
	{
		doc = Lib.document;
		window = Lib.window;

		this.boardAspectRatio = boardAspectRatio;
		_modelWidth = modelWidth;
		_modelHeight = modelHeight;

		winW = Math.max(winW, Std.int(window.innerWidth));
		winH = Math.max(winH, Std.int(window.innerHeight));

		screenLayout = new Layout(0, 0, Std.int(winW), Std.int(winH));

//		canvas = JSUtil.createCanvas(doc.body, 0, 0, Std.int(winW), Std.int(winH));
//		screenLayout.draw(canvas);
		createBoardLayout();
		createNotificationLayout();
		createOpponentMeterLayout();
		createPanelLayout();
		createLeftPanelLayout();
//		centerBoardAndPanel();
		createControlsLayout();
		createBackgroundLayout();
		createMenuLayout();
//		boardLayout.draw(canvas);
//		opponentMeterLayout.draw(canvas);
//		panelLayout.draw(canvas);
//		controlsLayout.draw(canvas);
    }

	function createOpponentMeterLayout()
	{
		opponentMeterLayout = new Layout(boardLayout.getRight() + PANEL_PADDING,
										boardLayout.y,
										METER_WIDTH,
										boardLayout.height);
	}

	function createMenuLayout()
	{
		menuLayout = new Layout(0, 0, Std.int(winW), Std.int(winH));
	}

	function createBoardLayout()
	{
		var height:Int = 0;
		var width:Int = 0;
		height = Std.int(winH - Assets.cloudsButtons.height + BOARD_AND_BUTTONS_OVERLAP);
		width = Std.int(height * boardAspectRatio);
		if (width + (PANEL_WIDTH + PANEL_PADDING * 2) * 2  > winW)
		{
			width = Std.int(winW - (PANEL_WIDTH + PANEL_PADDING * 2) * 2);
			height = Std.int(width / boardAspectRatio);
		}
		var x:Int = Std.int(winW / 2 - width / 2);
		boardLayout = new Layout(x, 0, roundToFitWidthBlocks(width), roundToFitHeightBlocks(height));
	}

	function roundToFitWidthBlocks(value:Float):Int
	{
		return Math.round(value / _modelWidth) * _modelWidth;
	}

	function roundToFitHeightBlocks(value:Float):Int
	{
		return Math.round(value / _modelHeight) * _modelHeight;
	}

	function createLeftPanelLayout()
	{
		leftPanelLayout = new Layout(boardLayout.x - PANEL_WIDTH - PANEL_PADDING, 0, PANEL_WIDTH, boardLayout.getBottom());
	}

	function createPanelLayout()
	{
		panelLayout = new Layout(boardLayout.getRight() + METER_WIDTH + PANEL_PADDING, boardLayout.y, PANEL_WIDTH, boardLayout.height);
	}

	function createNotificationLayout()
	{
		notificationLayout = boardLayout.clone();
		notificationLayout.height = NOTIFICATION_HEIGHT;
	}

	function createControlsLayout()
	{
		var height = Assets.cloudsButtons.height;
		controlsLayout = new Layout(0, screenLayout.height - height, screenLayout.width, height);
	}

	function createBackgroundLayout()
	{
		backgroundLayout = new Layout(0, 0, Std.int(winW), Std.int(winH));
	}

}

class Layout
{
	public var x:Int;
	public var y:Int;
	public var width:Int;
	public var height:Int;

	public function new(x:Int=0, y:Int=0, width:Int=0, height:Int=0)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	public function toString():String
	{
		return Std.format("[ xy: ${x}, ${y}, wh: ${width}, ${height}]");
	}

	public function draw(canvas:Dynamic)
	{
		var ctx:Dynamic = canvas.getContext("2d");
		ctx.strokeStyle = '#f00';
		ctx.strokeRect(x, y, width, height);
	}

	public function getRight():Int
	{
		return x + width;
	}

	public function getBottom():Int
	{
		return y + height;
	}

	public function inRect(point:Point):Bool
	{
		return (point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height);
	}

	public function intersection(other:Layout):Layout
	{
		var newLayout = new Layout();
		newLayout.x = Std.int(Math.max(x, other.x));
		newLayout.y = Std.int(Math.max(y, other.y));
		newLayout.width = Std.int(Math.min(getRight(), other.getRight()) - newLayout.x);
		newLayout.height = Std.int(Math.min(getBottom(), other.getBottom()) - newLayout.y);

		return newLayout;
	}

	public function expand(horizontal:Int, vertical:Int):Layout
	{
		var newLayout = clone();
		newLayout.x -= Std.int(horizontal / 2);
		newLayout.width += horizontal;
		newLayout.y -= Std.int(vertical / 2);
		newLayout.height += vertical;
		return newLayout;
	}

	public function applyToElement(element:HtmlDom)
	{
		JSUtil.applyLayout(element, x, y, width, height);
	}

	public function clone():Layout
	{
		return new Layout(x, y, width, height);
	}
}
