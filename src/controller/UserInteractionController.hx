package controller;

import view.ScreenLayouter;
import js.Dom;
import js.Lib;
import view.ControlButtons;

class UserInteractionController
{
	public var leftCallback:Void->Void;
	public var upCallback:Void->Void;
	public var rightCallback:Void->Void;
	public var downCallback:Void->Void;
	public var spaceCallback:Void->Void;
	public var pauseCallback:Void->Void;
	public var menuCallback:Void->Void;

	var _controlButtons:ControlButtons;
	var _interactionEnabled:Bool = false;
	var _boardLayout:Layout;

	public function new(controlButtons:ControlButtons, boardLayout:Layout)
	{
		_controlButtons = controlButtons;
		_boardLayout = boardLayout;
		var doc = Lib.document;
		doc.onkeydown = handleKeyDown;
		doc.onkeyup = handleKeyUp;
		doc.onkeypress = handleKeyPress;
		setupButtons();
	}

	public function setInteractionEnabled(value:Bool)
	{
		_interactionEnabled = value;
	}

	function setupButtons()
	{
		_controlButtons.leftCallback = doLeftCallback;
		_controlButtons.rightCallback = doRightCallback;
		_controlButtons.rotateCallback = doRotateCallback;
		_controlButtons.downCallback = doDownCallback;
		_controlButtons.menuCallback= doMenuCallback;
		_controlButtons.setEnabled(true);
	}

	function doLeftCallback()
	{
		if (_interactionEnabled) leftCallback();
	}

	function doRightCallback()
	{
		if (_interactionEnabled) rightCallback();
	}
	function doRotateCallback()
	{
		if (_interactionEnabled) upCallback();
	}

	function doDownCallback()
	{
		if (_interactionEnabled) downCallback();
	}

	function doMenuCallback()
	{
		menuCallback();
	}

	function handleKeyDown(event:Event)
	{
		event.stopPropagation();
		switch event.keyCode
		{
			case Keys.LEFT:
				if (_interactionEnabled) {leftCallback();}
			case Keys.UP:
				if (_interactionEnabled) {upCallback();}
			case Keys.RIGHT:
				if (_interactionEnabled) {rightCallback();}
			case Keys.DOWN:
				if (_interactionEnabled) {downCallback();}
			case Keys.SPACE:
				if (_interactionEnabled) {spaceCallback();}
			case Keys.P:
				pauseCallback();
			case Keys.N:
				menuCallback();
		}
	}

	function handleKeyUp(event)
	{

	}
	function handleKeyPress(event)
	{

	}
}

class Keys
{
	public static inline var SPACE = 32;
	public static inline var LEFT = 37;
	public static inline var UP = 38;
	public static inline var RIGHT = 39;
	public static inline var DOWN = 40;
	public static inline var P = 80;
	public static inline var N = 78;
}