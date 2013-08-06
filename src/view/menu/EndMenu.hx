package view.menu;
import view.VBox;
import util.JSUtil;
import util.JSUtil;
import util.JSUtil;
import js.Dom;
import view.ScreenLayouter;

class EndMenu extends Menu
{
	inline static var PLAY_AGAIN_BUTTON = 'gotoMainMenuButton';
	inline static var SHARE_BUTTON = 'shareButton';

	public var gotoMainMenu:Void->Void;
	public var gotoShareMenu:Void->Void;

	var gotoMainMenuButton:HtmlDom;
	var shareButton:HtmlDom;
	var opponentInfoLabel:HtmlDom;

	var _message:String;
	var _otherName:String;
	var _yourPoints:Int;

    public function new(backgroundLayout:Layout, message:String, yourPoints:Int, otherName:String)
	{
		_message = message;
		_otherName = otherName;
		_yourPoints = yourPoints;
		super(backgroundLayout);
		createMenuItems();
    }

	function createMenuItems()
	{
		var messageLabel = addLabel(_message, 30, 'h1');
		JSUtil.setWidth(messageLabel, _buttonLayout.width);
		container.add(messageLabel);
		addSeparatorWithDots();

		container.add(addLabel('Scores', 25, 'h2'));

		var vbox = new VBox('', '');
		var label = addLabel('Your score - ' + _yourPoints + ' points', 15, "h2");
		JSUtil.setWidth(label, _popupLayout.width);
		vbox.add(label);
		container.addBox(vbox);

		vbox = new VBox('', '');
		opponentInfoLabel = addLabel(getOpponentInfo(0), 15, "h2");
		JSUtil.setWidth(opponentInfoLabel, _popupLayout.width);
		vbox.add(opponentInfoLabel);
		container.addBox(vbox);
		addSeparator();
		gotoMainMenuButton = JSUtil.createButton('Play Again', PLAY_AGAIN_BUTTON, _buttonLayout, 'button greenButton', 0, 0, Menu.BUTTON_TEXT_SIZE);
		container.add(gotoMainMenuButton);
//		shareButton = JSUtil.createButton('Share the Fun', SHARE_BUTTON, _buttonLayout, 'button', 0, 0, Menu.BUTTON_TEXT_SIZE);
//		JSUtil.setBGColor(shareButton, Menu.COLOR2);
//		container.add(shareButton);
	}

	function getOpponentInfo(points:Int):String
	{
		return _otherName + "'s score - " + Std.string(points) + ' points';
	}

	public function updateOtherPoints(otherPoints:Int)
	{
		opponentInfoLabel.innerHTML = getOpponentInfo(otherPoints);
	}

	override function touchCallback(event:Dynamic)
	{
		if (removed) return;
		switch (event.target.id)
		{
			case PLAY_AGAIN_BUTTON + 'Hit':
				close();
				gotoMainMenu();
			case SHARE_BUTTON + 'Hit':
				close();
				gotoShareMenu();
		}
	}

}
