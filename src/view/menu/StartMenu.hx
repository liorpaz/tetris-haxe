package view.menu;

import view.HBox;
import view.DocElements;
import util.JSUtil;
import js.Lib;
import view.ScreenLayouter;
import js.Dom;

class StartMenu extends Menu
{
	inline static var START_GAME = 'startGameButton';
	inline static var INSTRUCTIONS = 'instructionsButton';

	public var startGame:?Int->?Bool->Void;
	public var showInstructions:Void->Void;

	var startGameButton:HtmlDom;
	var instructionsButton:HtmlDom;
	var highScoreLable:HtmlDom;

	var level:Int = 1;
	var _highScore:Int = 0;

	public function new(layout:Layout, highScore)
	{
		super(layout);
		createMenuItems(highScore);
	}

	function createMenuItems(highScore:Int)
	{
//		container.add(addLabel("Choose a Level"));
		addHighScore(highScore);
		addSeparatorWithDots();
//		addSeparator();
		startGameButton = JSUtil.createButton('Lets Tumble', START_GAME, _buttonLayout, 'button greenButton', 0, 0, Menu.BUTTON_TEXT_SIZE);
		instructionsButton = JSUtil.createButton('Instructions', INSTRUCTIONS, _buttonLayout, 'button', 0, 0, Menu.BUTTON_TEXT_SIZE);
		JSUtil.setBGColor(instructionsButton, Menu.COLOR2);
		container.add(startGameButton);
		container.add(instructionsButton);
		outerContainer.setAlign(center);
	}

	function addHighScore(highScore:Int)
	{
		var vbox = new VBox('highscorecontainer', '');
		vbox.setAlign(center);
		vbox.setSpacing(0);
		var yourHighScoreLable = JSUtil.createTextView('', "Beat Your Best Score:", "25px", 0, 0, 'h2');
		JSUtil.setOpacity(yourHighScoreLable, 0.6);
		JSUtil.setWidth(yourHighScoreLable, _popupLayout.width);
		vbox.add(yourHighScoreLable);

		var highScoreBox = new HBox('scorehbox', '');
		highScoreBox.setPadding(5);
		highScoreBox.setAlign(bottom);
		highScoreLable = JSUtil.createTextView('highScore', Std.string(highScore), "30px", 0, 0, 'h2');
		highScoreBox.add(highScoreLable);
		var pointsText = highScore == 1 ? 'point' : 'points';
		var pointsLabel = JSUtil.createTextView('points', pointsText, "30px", 0, -7, 'h2');
		highScoreBox.add(pointsLabel);


		vbox.addBox(highScoreBox);
		container.addBox(vbox);
	}

	public function updateHighScore(value:Int)
	{
		highScoreLable.innerHTML = Std.string(Int);
	}

	override function touchCallback(event:Dynamic)
	{
		super.touchCallback(event);
		switch (event.target.id)
		{
			case START_GAME + 'Hit':
			startGame(level);
			case INSTRUCTIONS + 'Hit':
				showInstructions();

		}
	}
}