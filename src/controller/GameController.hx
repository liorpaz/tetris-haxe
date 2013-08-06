package controller;

import view.notification.NotificationsController;
import view.SplashScreen;
import connection.ConnectionController;
import util.JSUtil;
import view.CloudController;
import view.PanelView;
import view.menu.EndMenu;
import view.menu.PauseMenu;
import view.menu.StartMenu;
import view.DocElements;
import js.JQuery;
import view.menu.Menu;
import view.ScreenLayouter;
import view.StringBoardView;
import view.BoardView;
import js.Dom;
import js.Lib;

import haxe.Timer;

import model.ShapeStore;
import model.Shape;
import model.TetrisBoard;
import view.ControlButtons;
import view.DomBoardView;
import view.NextShapePreview;
import util.ArrayUtil;
import util.JSUtil;

class GameController
{
	public inline static var MODEL_WIDTH = 10;
	public inline static var MODEL_HEIGHT = 20;
	public inline static var LINES_PER_LEVEL = 5;
	public inline static var OPPONENT_LINE_COLOR = 7;
	public inline static var WINNER_EXTRA_POINTS = 300;

	inline static var DANGER_ZONE_RATIO:Float = 0.7;
	inline static var OPPONENT_ABOUT_TO_LOOSE_MSG:String = 'Almost there! Your friend is about to lose';

	public var screenLayouter:ScreenLayouter;

	var tetrisBoard:TetrisBoard;
	var shapeController:ShapeController;
	var interaction:UserInteractionController;
	var backgroundController:BackgroundController;
	var cloudController:CloudController;
	var boardView:BoardView;
	var panelView:PanelView;
	var nextShapePreview:NextShapePreview;
	var menuController:MenuController;
	var opponentStateMeter:OpponentStateMeter;

	var currentShape:Shape;
	var blockWidth:Int;
	var blockHeight:Int;
	var nextShapeIndex:Int;
	var gameState:GameState;
	var _connectionController:ConnectionController;
	var _notificationController:NotificationsController;
	var _opponentWaiting:Bool = false;

	public var sendLinesToOpponentCallback:Int->Void;
	public var splashScreen:SplashScreen;

	public function new(screenLayouter:ScreenLayouter)
	{
		tetrisBoard = new TetrisBoard(MODEL_WIDTH, MODEL_HEIGHT);
		gameState = new GameState(LINES_PER_LEVEL);
		shapeController = new ShapeController(tetrisBoard);
		this.screenLayouter = screenLayouter;
		menuController = new MenuController(screenLayouter.backgroundLayout, this);
		_notificationController = new NotificationsController(screenLayouter.notificationLayout);
		splashScreen = new SplashScreen(screenLayouter.backgroundLayout);
		splashScreen.show();
	}

	public function getConnectionController():ConnectionController
	{
		return _connectionController;
	}

	public function setConnectionController(connectionController:ConnectionController)
	{
		_connectionController = connectionController;
		menuController.setConnectionController(connectionController);
		opponentStateMeter.addPlayer(getOpponentName(), 0xEBA53E);
	}

	public function showClouds()
	{
		if (cloudController == null)
		{
			cloudController = new CloudController(screenLayouter.screenLayout, DocElements.cloudContainer);
			cloudController.createClouds();
		}
	}

	public function createGameView()
	{
		createView();
		setInteraction();
	}

	public function setGameVisible(value:Bool)
	{
		JSUtil.setVisibility(DocElements.mainElement, value);
		JSUtil.setVisibility(DocElements.controlsContainer, value);
	}

	public function showMainMenu()
	{
		if (splashScreen != null)
		{
			splashScreen.close();
			splashScreen = null;
		}
		menuController.showStartMenu(true, true, startGame, showInstructions, gameState.getHighScore());
	}

	function showInstructions()
	{
		menuController.showInstructionsMenu(showMainMenu);
	}

	function showPauseMenu()
	{
		menuController.showPauseMenu(true, true, pauseGame, leaveGame);
	}

	function showLooseMenu()
	{
		menuController.showEndMenu(true, true, showMainMenu, showShareMenu, false);
	}

	function showWinMenu()
	{
		menuController.showEndMenu(true, true, showMainMenu, showShareMenu, true);
	}

	function showShareMenu()
	{
		menuController.showShareMenu(true, true, share, cancelShare);
	}

	function share(text:String)
	{
		showMainMenu();
	}

	function cancelShare()
	{
		showMainMenu();
	}

	function leaveGame()
	{
		_connectionController.announceLose();
		resetGame();
		showMainMenu();
	}

	function createView()
	{
		backgroundController = new BackgroundController(screenLayouter.boardLayout);
		blockWidth = Math.round(screenLayouter.boardLayout.width / MODEL_WIDTH );
		blockHeight = blockWidth;
		boardView = new DomBoardView(tetrisBoard,
									screenLayouter.boardLayout.x,
									screenLayouter.boardLayout.y,
									GameController.MODEL_WIDTH,
									GameController.MODEL_HEIGHT,
									blockWidth,
									blockHeight);
		var previewSize = screenLayouter.panelLayout.width - PanelView.PADDING_X;
		nextShapePreview = new NextShapePreview(previewSize, previewSize);

		panelView = new PanelView(screenLayouter.panelLayout, screenLayouter.leftPanelLayout, nextShapePreview);
		panelView.pauseCallback = pauseGame;
		opponentStateMeter = new OpponentStateMeter(screenLayouter.opponentMeterLayout, blockHeight);
	}

	function getOpponentName():String
	{
		var participents = _connectionController.getParticipents();
		return participents.length > 0 ? participents[0].displayName : "Other";
	}

	public function opponentForceStartedGame()
	{
		if (gameState.getInGame())
		{
			return;
		}
		_waitingForOpponent = true;
		_opponentWaiting = true;
		opponentStartedGame();
	}

	var _waitingForOpponent:Bool = false;
	public function opponentStartedGame()
	{
		if (_waitingForOpponent)
		{
			menuController.closeAll();
			startGame(1, true);
		}
		else
		{
			_opponentWaiting = true;
		}
	}

	var timer:Timer;
	public function startGame(initialLevel:Int=1, initFromOpponent:Bool=false)
	{
		if (!initFromOpponent)
		{
			_connectionController.sendStartGame();
		}
		if (!Tetris.doNotWaitForOpponent && !_opponentWaiting && !_waitingForOpponent)
		{
			_waitingForOpponent = true;
			menuController.showWaitingForOpponent();
			return;
		}
		_connectionController.sendStartingGame();
		menuController.closeAll();

		resetGame();
		setGameVisible(true);

		gameState.setInitialLevel(initialLevel);
		gameState.initLines();
		panelView.resetWithLevel(initialLevel);
		startTimer();
		shapeController.addNewShape(getRandomShape());
		updateShape();

		_opponentWaiting = false;
		_waitingForOpponent = false;
	}

	function resetGame()
	{
		JSUtil.setOpacity(DocElements.mainElement, 1);
		interaction.setInteractionEnabled(true);
		stopTimer();
		tetrisBoard.clear();
		boardView.clear();
		opponentStateMeter.resetPositions();
		setNextShapeIndex();
	}

	function startTimer()
	{
		if (timer != null)
		{
			timer.stop();
		}
		timer = new Timer(gameState.getIntervalMs());
		timer.run = tick;
		interaction.setInteractionEnabled(true);
		gameState.state = inGame;
	}

	function tick()
	{
		if (!shapeController.moveDown())
		{
			var numRemovedLines:Int = removeFullLines();
			var linesToSend:Int = numRemovedLines - 1;
			if (linesToSend > 0)
			{
				var msg:String = 'Great job! You just sent ' +
					linesToSend +
					' row' +
					(linesToSend > 1 ? 's' : '') +
					' to your friend!';
				_notificationController.showNotification(msg);
				sendLinesToOpponent(linesToSend);
			}
			if (!shapeController.addNewShape(currentShape = getRandomShape()))
			{
				gameState.state = playerLost;
				pauseGame();
			}
			_connectionController.sendHeightChanged(getHeightRatio());
		}
		updateShape();
	}

	function sendLinesToOpponent(numLines:Int)
	{
		sendLinesToOpponentCallback(numLines);
	}

	public function setPlayerMeter(playerIndex:Int, ratio:Float)
	{
		if (ratio >= DANGER_ZONE_RATIO && gameState.getOpponentRatio() < DANGER_ZONE_RATIO)
		{
			opponentStateMeter.setPlayerInDangerZone(0);
			if (getHeightRatio() < DANGER_ZONE_RATIO)
			{
				_notificationController.showNotification(OPPONENT_ABOUT_TO_LOOSE_MSG);
			}
		}
		else if (ratio < DANGER_ZONE_RATIO && gameState.getOpponentRatio() >= DANGER_ZONE_RATIO)
		{
			opponentStateMeter.setPlayerOutOfDangerZone(0);
		}
		opponentStateMeter.setPlayerHeight(0, ratio);
		gameState.setOpponentRatio(ratio);
	}

	public function getHeightRatio():Float
	{
		return getTopLine() / MODEL_HEIGHT;
	}

	public function getGameState():GameState
	{
		return gameState;
	}

	public function getTopLine():Int
	{
		return MODEL_HEIGHT - tetrisBoard.getTopLine(shapeController.getCurrentShape());
	}

	public function getLines(numLines:Int)
	{
		tetrisBoard.addRandomLines(numLines, OPPONENT_LINE_COLOR, shapeController.getCurrentShape());
		boardView.addBottomLines(numLines);
		_connectionController.sendHeightChanged(getHeightRatio());

		showLinesFromFriendNotification(numLines);
	}

	function showLinesFromFriendNotification(numLines:Int)
	{
		var opponentName = getOpponentName();
		var msg = 'Oh no! Your friend just sent you '+ numLines+' line';
		if (numLines > 1)
		{
			msg += "s";
		}
		_notificationController.showNotification(msg);
	}

	function removeFullLines():Int
	{
		var shape = shapeController._currentShape;
		var currentLines:Array<Int> = ArrayUtil.range(shape.y,(shape.y + shape.getHeight()));
		var removedLines = tetrisBoard.removeFullLines(currentLines);
		updateStats(removedLines.length);
		boardView.removeLines(removedLines);
		return removedLines.length;
	}

	function updateStats(removedLines:Int)
	{
		if (removedLines > 0)
		{
			gameState.addLines(removedLines);
			startTimer();
		}
		panelView.setState(gameState);

		_connectionController.sendPoints(gameState.getPoints());
	}

	public function setOpponentPoints(points:Int)
	{
		gameState.setOpponentPoints(points);
		panelView.setOpponentPoints(points);
	}

	function getRandomShape():Shape
	{
		var result = new Shape(ShapeStore.shapes[nextShapeIndex], nextShapeIndex);
		setNextShapeIndex();
		nextShapePreview.updateShape(new Shape(ShapeStore.shapes[nextShapeIndex], nextShapeIndex));
		return result;
	}

	function setNextShapeIndex()
	{
		nextShapeIndex = Math.floor(Math.random() * ShapeStore.getLength());
	}

	function updateShape()
	{
		boardView.updateShape(shapeController.getCurrentShape());
	}

	public function pauseGame(fromOtherUser:Bool=false)
	{
		switch (gameState.state)
		{
			case beforeGame:
				return;
			case inGame:
				if (menuController.menuIsOpen())
				{
					return;
				}
				JSUtil.setOpacity(DocElements.mainElement, 0);
				stopTimer();
				gameState.state = paused;
				showPauseMenu();
				if (!fromOtherUser)
				{
					_connectionController.sendPause();
				}
			case paused:
				_notificationController.removeNotification(false);
				JSUtil.setOpacity(DocElements.mainElement, 1);
				menuController.closeAll();
				startTimer();
				gameState.state = inGame;
				if (!fromOtherUser)
				{
					_connectionController.sendResume();
				}
			case playerLost:
				_notificationController.removeNotification(false);
				JSUtil.setOpacity(DocElements.mainElement, 0);
				stopTimer();
				updateHighScore();
				showLooseMenu();
				_connectionController.announceLose();
			case playerWon:
				_notificationController.removeNotification(false);
				JSUtil.setOpacity(DocElements.mainElement, 0);
				stopTimer();
				updateHighScore();
				showWinMenu();
		}
	}

	function updateHighScore()
	{
		if (gameState.getPoints() > gameState.getHighScore())
		{
			gameState.setHighScore(gameState.getPoints());
			_connectionController.setUserData(ConnectionController.HIGH_SCORE, Std.string(gameState.getPoints()));
		}
	}

	function handleHighScoreReceived(key:String, value:String)
	{
		gameState.setHighScore(Std.parseInt(value));
		menuController.gameStateUpdate(gameState);
	}

	public function otherPlayerLost(opponentPoints:Int)
	{
		gameState.state = playerWon;
		gameState.addPoints(WINNER_EXTRA_POINTS);
		gameState.setOpponentPoints(opponentPoints);
		_connectionController.announceWinningStats();
		pauseGame();
	}

	public function gotWinnerPoints(opponentPoints:Int)
	{
		gameState.setOpponentPoints(opponentPoints);
		menuController.updateOtherPoints(opponentPoints);
	}

	function endGame()
	{
		gameState.state = playerLost;
		showLooseMenu();
	}

	function stopTimer()
	{
		if (timer != null)
		{
			timer.stop();
		}
		interaction.setInteractionEnabled(false);
	}

	function moveLeft()
	{
		shapeController.moveLeft();
		updateShape();
	}

	function moveRight()
	{
		shapeController.moveRight();
		updateShape();
	}

	function moveDown()
	{
		shapeController.moveDown();
		updateShape();
	}

	function rotate()
	{
		shapeController.rotateRight();
		updateShape();
	}

	function doPause()
	{
		pauseGame();
	}

	function doSpace()
	{
		getLines(3);
	}

	function doNewGame()
	{
		startGame();
	}

	var controlButtons:ControlButtons;

	function setInteraction()
	{
		controlButtons = new ControlButtons(screenLayouter.controlsLayout, screenLayouter.boardLayout);
		interaction = new UserInteractionController(controlButtons, screenLayouter.boardLayout);
		var boardBottom = JSUtil.fromCssPixel(boardView.getView().style.height) +
			JSUtil.fromCssPixel(boardView.getView().style.top);

		interaction.leftCallback = moveLeft;
		interaction.rightCallback = moveRight;
		interaction.downCallback = moveDown;
		interaction.upCallback = rotate;
		interaction.pauseCallback = doPause;
		interaction.spaceCallback = doSpace;
	}

}
