package view.menu;

import view.Spacer;
import view.menu.Menu;
import view.menu.Menu;
import util.JSUtil;
import util.JSUtil;
import view.ScreenLayouter;
import js.Dom;

class PauseMenu extends Menu
{

	inline static var CONTINUE_GAME = 'continueGameButton';
	inline static var LEAVE_GAME = 'leaveGameButton';

	public var continueGame:?Bool->Void;
	public var leaveGame:Void->Void;

	var continueGameButton:HtmlDom;
	var leaveGameButton:HtmlDom;

	public function new(backgroundLayout:Layout)
	{
		super(backgroundLayout);
		createMenuItems();
	}

	function createMenuItems()
	{
		container.add(addLabel('Game Paused', -1, 'h1', 0x145769));

		var spacer = new Spacer(_buttonLayout.width, _buttonLayout.height);
		container.add(spacer.getView());

		continueGameButton = JSUtil.createButton('Resume', CONTINUE_GAME, _buttonLayout, 'button greenButton', 0, 0, Menu.BUTTON_TEXT_SIZE);
		container.add(continueGameButton);


		leaveGameButton = JSUtil.createButton('Quit Game', LEAVE_GAME, _buttonLayout, 'button redButton', 0, 0, Menu.BUTTON_TEXT_SIZE);
		container.add(leaveGameButton);
		outerContainer.setAlign(center);
	}

	override function touchCallback(event:Dynamic)
	{
		if (removed) return;

		switch (event.target.id)
		{
			case CONTINUE_GAME + 'Hit':
				close();
				continueGame();
			case LEAVE_GAME + 'Hit':
				leaveGame();
		}
	}

}
