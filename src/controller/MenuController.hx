package controller;

import view.menu.WaitingForOpponentMenu;
import util.JSUtil;
import connection.ConnectionController;
import view.menu.ShareMenu;
import view.menu.PauseMenu;
import view.menu.EndMenu;
import feffects.Tween;
import feffects.easing.Cubic;

import js.Dom;

import util.JSUtil;
import util.AnimationUtil;
import view.DocElements;
import view.menu.Menu;
import view.menu.StartMenu;
import view.menu.InstructionsMenu;
import view.ScreenLayouter;

class MenuController
{
	inline static var MENU_X:Int = 20;
	inline static var BACKGROUND_OPACITY:Float = 0.4;
	inline static var BG_FADEIN_MS:Int = 100;
	inline static var BACKGROUND_PADDING_RATIO_X:Float = 0.1;
	inline static var BACKGROUND_PADDING_RATIO_Y:Float = 0.2;

	var _backgroundLayout:Layout;
	var screenLayout:Layout;
	var menuContainer:HtmlDom;
	var background:HtmlDom;
	var fullBackground:HtmlDom;
	var backgroundVisible:Bool = false;
	var fadingOut:Bool = false;

	var menus:Array<Menu>;
	var _gameController:GameController;

	var currentMenu:Menu;
	var pendingMenu:Menu;

	var _connectionController:ConnectionController;

    public function new(backgroundLayout:Layout, gameController:GameController)
	{
		screenLayout = backgroundLayout.clone();
		menuContainer = DocElements.menuContainer;
		var paddingX = Std.int(backgroundLayout.width * BACKGROUND_PADDING_RATIO_X);
		var paddingY = Std.int(backgroundLayout.width * BACKGROUND_PADDING_RATIO_Y);
		_backgroundLayout = backgroundLayout.expand(-paddingX, -paddingY);
		_gameController = gameController;
		background = DocElements.getNewElement('div', 'menuBackground', 'menuBackground');
		JSUtil.setOpacity(background, 0);
		_backgroundLayout.applyToElement(background);

		fullBackground = DocElements.getNewElement('div', 'menuFullBackground', 'menuFullBackground');
		screenLayout.applyToElement(fullBackground);
		menus = [];
    }

	public function setConnectionController(value:ConnectionController)
	{
		_connectionController = value;
	}
	public function showStartMenu(animate:Bool=true, fadeInBG:Bool=true, startGameCallback:?Int->?Bool->Void, showInstructionsGameCallback:Void->Void, highScore:Int)
	{
		var menu = new StartMenu(_backgroundLayout, highScore);
		menu.startGame = startGameCallback;
		menu.showInstructions = showInstructionsGameCallback;
		showBackground(fadeInBG);
		show(menu, animate);

		if (currentMenu == null)
		{
			currentMenu = menu;
		}
		else
		{
			pendingMenu = menu;
		}
	}

	public function showWaitingForOpponent()
	{
		var menu = new WaitingForOpponentMenu(_backgroundLayout);
		showFullScreenBackground();
		show(menu, true);
	}

	public function showPauseMenu(animate:Bool=true, fadeInBG:Bool=true, pauseGame:?Bool->Void, leaveGame:Void->Void)
	{
		var menu:PauseMenu = new PauseMenu(_backgroundLayout);
		menu.continueGame = pauseGame;
		menu.leaveGame= leaveGame;
		showFullScreenBackground();
		show(menu, animate);
	}

	public function showEndMenu(animate:Bool=true,
								 fadeInBG:Bool=true,
								 gotoMainMenuCallback:Void->Void,
								 gotoShareMenuCallback:Void->Void,
								 isWinner:Bool)

	{
		var menu:EndMenu = new EndMenu(_backgroundLayout,
						isWinner ? "WINNER!" : "GAME OVER!",
						_gameController.getGameState().getPoints(), getOpponentName());

		menu.gotoMainMenu = gotoMainMenuCallback;
		menu.gotoShareMenu = gotoShareMenuCallback;
		showBackground(fadeInBG);
		show(menu, animate);

		menu.updateOtherPoints(_gameController.getGameState().getOpponentPoints());
		if (currentMenu == null)
		{
			currentMenu = menu;
		}
		else
		{
			pendingMenu = menu;
		}
	}

	function getOpponentName():String
	{
		var participents = _connectionController.getParticipents();
		var opponentName = "Friend";
		if (participents.length > 0)
		{
			if (participents[0].name != null)
			{
				opponentName = participents[0].name;
			}
			else if (participents[0].displayName != null)
			{
				opponentName = participents[0].displayName;
			}
		}
		return  opponentName;
	}

	public function showShareMenu(animate:Bool=true, fadeInBG:Bool=true, shareCallback:String->Void, cancelCallback:Void->Void)
	{
		var menu:ShareMenu = new ShareMenu(_backgroundLayout);
		menu.shareCallback = shareCallback;
		menu.cancelCallback = cancelCallback;
		showBackground(fadeInBG);
		show(menu, animate);
	}

	public function showInstructionsMenu(closeCallback:Void->Void)
	{
		var menu:InstructionsMenu = new InstructionsMenu(_backgroundLayout);
		menu.closeCallback = closeCallback;
		showBackground(false);
		show(menu, false);
	}

	function show(menu:Menu, animate:Bool=true)
	{
		closeAll(false);
		menus.push(menu);
		if (false && animate)
		{
			JSUtil.setOpacity(menu.getView(), 0);

			AnimationUtil.fadeIn(menu.getView(), BG_FADEIN_MS);
		}
		menuContainer.appendChild(menu.getView());
		menu.addedToDom();
	}

	function centerMenu(element:HtmlDom)
	{
		var width = JSUtil.getWidth(element);
		var height = JSUtil.getHeight(element);
		var newX = Std.int((_backgroundLayout.width - width ) / 2);
		var newY = MENU_X;
		JSUtil.setPosition(element, _backgroundLayout.x + newX, _backgroundLayout.y + newY);
	}

	function close(menu:Menu, animate:Bool=true)
	{
		if (menu == currentMenu && pendingMenu != null)
		{
			currentMenu = pendingMenu;
			pendingMenu = null;
		}

		menus.remove(menu);
		menu.close();
		if (animate)
		{
			AnimationUtil.fadeOut(menu.getView(), BG_FADEIN_MS, null, function()
			{
				if (menuContainer.parentNode != null)
				{
					menuContainer.removeChild(menu.getView());
					if (menus.length == 0)
					{
						menuContainer.style.visibility = "hidden";
					}
				}
			});
		}
		else
		{
			menu.getView().style.visibility = "hidden";
			menuContainer.removeChild(menu.getView());
			if (menus.length == 0)
			{
				menuContainer.style.visibility = "hidden";
			}
		}
	}

	function moveOutFinished(menu:Menu)
	{
		menuContainer.removeChild(menu.getView());
	}

	function update(value:Float, menu:Menu)
	{
		menu.getView().style.top = JSUtil.cssPixelsFloat(value);
	}

	public function closeAll(removeBackground:Bool=true)
	{
		while(menus.length > 0)
		{
			close(menus[menus.length-1], true);
		}
		if (removeBackground)
		{
			hideBackground();
			_gameController.setGameVisible(true);
			removeFullScreenBackground();
		}

		pendingMenu = null;
		currentMenu = null;
	}

	function showFullScreenBackground()
	{
		menuContainer.style.visibility = "inherit";
		if (fullBackground.parentNode == null)
		{
			menuContainer.appendChild(fullBackground);
		}
	}

	function removeFullScreenBackground()
	{
		if (fullBackground.parentNode != null)
		{
			menuContainer.removeChild(fullBackground);
		}
	}

	function showBackground(fadeIn:Bool=true)
	{
		removeFullScreenBackground();
		menuContainer.style.visibility = "inherit";
		if (background.parentNode == null)
		{
			menuContainer.appendChild(background);
		}

		JSUtil.setOpacity(background, 0);

		if (fadeIn)
		{
			AnimationUtil.fadeIn(background, BG_FADEIN_MS, null, null, BACKGROUND_OPACITY);
		}
		else
		{
			JSUtil.setOpacity(background, BACKGROUND_OPACITY);
		}
		_gameController.setGameVisible(false);
	}

	function hideBackground(fadeOut:Bool=true)
	{
		if (background.parentNode != null && !fadingOut)
		{
			if (fadeOut)
			{
				fadingOut = true;
				AnimationUtil.fadeOut(background, BG_FADEIN_MS, null, function()
				{
					menuContainer.style.visibility = "hidden";
					fadingOut = false;
				}, BACKGROUND_OPACITY);
			}
			else
			{
				menuContainer.style.visibility = "hidden";
			}
		}
	}

	public function menuIsOpen():Bool
	{
		return menus.length > 0;
	}

	public function gameStateUpdate(gameState:GameState)
	{
		if (Std.is(currentMenu, StartMenu))
		{
			cast(currentMenu, StartMenu).updateHighScore(gameState.getHighScore());
		}
	}

	public function updateOtherPoints(otherPoints:Int)
	{
		if (Std.is(currentMenu, EndMenu))
		{
			cast(currentMenu, EndMenu).updateOtherPoints(otherPoints);
		}
	}
}