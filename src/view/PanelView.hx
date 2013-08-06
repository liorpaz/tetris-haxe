package view;

import controller.GameState;
import util.JSUtil;
import util.JSUtil;
import event.TouchEvent;
import util.JSUtil;
import js.Lib;
import js.Dom;
import js.JQuery;
import view.ScreenLayouter;

class PanelView
{
	static inline var VALUE_SIZE = '30px';
	static inline var POINTS_SIZE = '26px';
	static inline var LABEL_SIZE = '15px';

	public static inline var PADDING_Y:Int = 3;
	public static inline var PADDING_X:Int = 0;
	static inline var PAUSE_BUTTON_ID:String = 'pause';

	public var pauseCallback:?Bool->Void;

	var touchCallbackRef:Dynamic->Void;

	var rightContainer:VBox;
	var leftContainer:VBox;

	var lines:HtmlDom;
	var level:HtmlDom;
	var points:HtmlDom;
	var opponentPoints:HtmlDom;
	var doc:Document;

	var pauseButton:HtmlDom;

	var _preview:NextShapePreview;
	var _layout:Layout;
	var _leftLayout:Layout;
	var jquery:JQuery;

	var pointsFontSize:String;

    public function new(layout:Layout, leftLayout:Layout, preview:NextShapePreview)
	{
		_layout = layout;
		_leftLayout = leftLayout;
		_preview = preview;
		doc = Lib.document;
		jquery = new JQuery(DocElements.mainNameHash);

		rightContainer = new VBox('rightPanel', 'panel');
		rightContainer.setPadding(PADDING_Y);
		rightContainer.setSpacingY(3);
		rightContainer.setAlign(center);
		DocElements.mainElement.appendChild(rightContainer.getView());
		layout.applyToElement(rightContainer.getView());
		rightContainer.setFixedWidth(_layout.width);

		leftContainer = new VBox('leftPanel', 'panel');
		leftContainer.setPadding(PADDING_Y);
		leftContainer.setSpacingY(12);
		leftContainer.setAlign(center);
		DocElements.mainElement.appendChild(leftContainer.getView());
		leftLayout.applyToElement(leftContainer.getView());
		leftContainer.setFixedWidth(_leftLayout.width);

		createElements();
		addListeners();
	}

	function createElements()
	{
		var lastX = PADDING_X;
		var buttonSize = _layout.width - PADDING_X;
		pointsFontSize = JSUtil.cssPixels(buttonSize- 5);

		leftContainer.add(_preview.getView());

		lastX += PADDING_X + buttonSize;

		pauseButton = JSUtil.createRoundButton(PAUSE_BUTTON_ID, new Layout(lastX, PADDING_X, buttonSize, buttonSize), Assets.pauseButton);
		leftContainer.add(pauseButton);

		rightContainer.addBox(getPointsIndicator(buttonSize));
		rightContainer.addBox(getLinesIndicator(buttonSize));
		rightContainer.addBox(getLevelIndicator(buttonSize));
		rightContainer.addBox(getOpponentPointsIndicator(buttonSize));
	}

	function getLinesIndicator(width:Int):Box
	{
		var vbox = new VBox('', '');
		vbox.setAlign(center);
		vbox.setPadding(-15);
		lines = JSUtil.createTextView('lines', '0', VALUE_SIZE, 0, 0, 'h3');
		var linesLabel = JSUtil.createTextView('linesLabel', 'lines', LABEL_SIZE, 0, 0, 'h3');
		JSUtil.applyDimentions(lines, width, width);
		JSUtil.setWidth(linesLabel, _layout.width);
		vbox.add(lines);
		vbox.add(linesLabel);
		return vbox;
	}

	function getPointsIndicator(width:Int):Box
	{
		var vbox = new VBox('', '');
		vbox.setAlign(center);
		vbox.setPadding(-15);
		points = JSUtil.createTextView('points', '0', POINTS_SIZE, 0, 0, 'h3');
		var pointsLabel = JSUtil.createTextView('pointsLabel', 'your\npoints', LABEL_SIZE, 0, 0, 'h3');
		JSUtil.applyDimentions(points, width, width);
		JSUtil.setWidth(pointsLabel, _layout.width);
		vbox.add(points);
		vbox.add(pointsLabel);
		return vbox;
	}

	function getLevelIndicator(width:Int):Box
	{
		var vbox = new VBox('', '');
		vbox.setAlign(center);
		vbox.setPadding(-15);
		level = JSUtil.createTextView('level', '0', VALUE_SIZE, 0, 0, 'h3');
		var levelLabel = JSUtil.createTextView('levelLabel', 'level', LABEL_SIZE, 0, 0, 'h3');
		JSUtil.applyDimentions(level, width, width);
		JSUtil.setWidth(levelLabel, _layout.width);
		vbox.add(level);
		vbox.add(levelLabel);
		return vbox;
	}

	function getOpponentPointsIndicator(width:Int):Box
	{
		var vbox = new VBox('', '');
		vbox.setAlign(center);
		vbox.setPadding(-15);
		opponentPoints = JSUtil.createTextView('opponentPoints', '0', POINTS_SIZE, 0, 0, 'h3');
		var opponentPointsLabel = JSUtil.createTextView('opponentPointsLabel', 'friends\npoints', LABEL_SIZE, 0, 0, 'h3');
		JSUtil.applyDimentions(opponentPoints, width, width);
		JSUtil.setWidth(opponentPointsLabel, _layout.width);
		vbox.add(opponentPoints);
		vbox.add(opponentPointsLabel);
		return vbox;
	}

	public function setState(gameState:GameState)
	{
		setLines(gameState.getLines());
		setLevel(gameState.getLevel());
		setPoints(gameState.getPoints());
	}

	function setLines(lines:Int)
	{
		this.lines.innerHTML = Std.string(lines);
	}

	function setLevel(level:Int)
	{
		this.level.innerHTML = Std.string(level);
	}

	function setPoints(value:Int)
	{
		points.innerHTML = Std.string(value);
	}

	public function setOpponentPoints(value:Int)
	{
		opponentPoints.innerHTML = Std.string(value);
	}

	public function getView():HtmlDom
	{
		return rightContainer.getView();
	}

	public function resetWithLevel(initLevel:Int)
	{
		setLines(0);
		setPoints(0);
		setLevel(initLevel);
	}

	function addListeners()
	{
		touchCallbackRef = touchCallback;
		if (JSUtil.isTouchDevice())
		{
			JSUtil.addEventListener(js.Lib.document.body, TouchEvent.TOUCH_END, touchCallbackRef);
		}
		else
		{
			JSUtil.addEventListener(js.Lib.document.body, 'click', touchCallbackRef);
		}
	}

	function removeListeners()
	{
		if (JSUtil.isTouchDevice())
		{
			JSUtil.removeEventListener(DocElements.mainElement, TouchEvent.TOUCH_END, touchCallbackRef);
		}
		else
		{
			JSUtil.removeEventListener(js.Lib.document.body, 'click', touchCallbackRef);
		}
	}

	function touchCallback(event:Dynamic)
	{
		switch (event.target.id)
		{
			case PAUSE_BUTTON_ID + 'Hit':
				pauseCallback();
		}
	}
}
