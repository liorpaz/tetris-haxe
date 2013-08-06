package ;

import js.Dom;
import util.DebugConsole;
import view.CloudController;
import connection.ConnectionController;
import js.Lib;
import view.DocElements;
import util.AnimationUtil;
import util.JSUtil;
import view.ScreenLayouter;
import haxe.Timer;
import view.SplashScreen;
import controller.GameController;

class Tetris {

	inline static var SPLASH_DURATION:Int = 1000;

	static var splashScreen:SplashScreen;
	static var splashTimer:Timer;

	static var connectionController:ConnectionController;

	public static var doNotWaitForOpponent:Bool = false;

	static function main()
	{
	}

	public static function init()
	{
		setDebugConsole();

		var layouter = new ScreenLayouter(GameController.MODEL_WIDTH / GameController.MODEL_HEIGHT, GameController.MODEL_WIDTH, GameController.MODEL_HEIGHT);
		var gameController:GameController = new GameController(layouter);
		gameController.createGameView();
		gameController.setGameVisible(false);
		connectionController = new ConnectionController(gameController);
		gameController.showClouds();
		gameController.setConnectionController(connectionController);

		connectionController.init();

		splashTimer = new Timer(SPLASH_DURATION);
		splashTimer.run = startApp;
	}

	static function setDebugConsole()
	{
		var query:String = untyped { __js__("window.location.search.substring(1)"); };
		var params = query.split("&");
		var i:Int = 0;
		while (i < params.length)
		{
			var param = params[i];
			if (param == 'debug')
			{
				DebugConsole.enabled = true;
			}
			if (param == 'single')
			{
				doNotWaitForOpponent = true;
			}
			i++;
		}
	}

	static var startAppCounter:Int = 0;
	static function startApp()
	{
		var query = untyped { __js__("window.location.search.substring(1)"); };

		connectionController.startGame();

		splashTimer.stop();
		splashTimer = null;
	}
}
