package connection;

import util.JSUtil;
import connection.wasabi.WasabiWrapper;
import util.DebugConsole;
import util.AnimationUtil;
import haxe.Json;
import connection.MockWasabi;
import connection.ICollabService;
import connection.RoundsConsts;
import connection.wasabi.WasabiWrapper;
import controller.GameController;

class ConnectionController
{
	public inline static var LINES_RECEIVED:String = 'linesReceived';
	public inline static var HEIGHT_RATIO:String = 'heightRatio';
	public inline static var PLAYER_LOST:String = 'playerLost';
	public inline static var PLAYER_WON:String = 'playerWon';
	public inline static var START_GAME:String = 'startGame';
	public inline static var FORCE_START_GAME:String = 'forceStartGame';
	public inline static var NEXT_TUTORIAL_PAGE:String = 'nextTutorialPage';
	public inline static var PAUSE_GAME:String = 'pauseGame';
	public inline static var RESUME_GAME:String = 'resumeGame';
	public inline static var POINTS:String = "points";

	public inline static var USER_TOP_SCORE_KEY:String = 'userTopScoreKey';
	public inline static var USER_TOP_LINES_KEY:String = 'userTopLinesKey';

	public inline static var HIGH_SCORE:String = 'highScore';

	var _gameController:GameController;
	var collabService:ICollabService;

	var _participents:Array<Dynamic>;
	var _currentUser:Dynamic;

	var messageQueue:Array<String>;

	var _otherConnected:Bool = false;

	public function new(gameController:GameController)
	{
		_gameController = gameController;
		_participents = [];
		messageQueue = [];
		#if usemock
			collabService = MockWasabi.getInstance();
		#else
			collabService = WasabiWrapper.getInstance();
		#end
    }

	public function init()
	{
		collabService.addEventListener(RoundsConsts.PARTICIPANT_CONNECTED, handleParticipentConnected);
		collabService.connect();
		collabService.addEventListener(RoundsConsts.MESSAGE_RECEIVED, handleMessageReceived);
		getParticipantsInfo(handleReceivedParticipantsInfo);
		collabService.getCurrentUser(function(user:Dynamic)
		{
			_currentUser = user;
		});
	}

	public function startGame()
	{
		getUserData(HIGH_SCORE, handleReceivedHighScore, 0);
	}

	function handleParticipentConnected(eventID:String, objType:String, user:Dynamic)
	{
		_participents.push(user);
		dispatchQueuedMessages();
	}

	function dispatchQueuedMessages()
	{
//		DebugConsole.getInstance().log("empty message queue" + messageQueue.length);
		while (messageQueue.length > 0)
		{
			var message = messageQueue.shift();
			collabService.sendMessage(message);
		}
	}

	function handleReceivedHighScore(key:String, value:String)
	{
		if (value == "999999") value = "0"; // why was it 999999???
		var highScore:Int = Std.parseInt(value);
		_gameController.getGameState().setHighScore(highScore);
		_gameController.showMainMenu();
		_gameController.sendLinesToOpponentCallback = linesShouldBeSent;
	}

	function handleReceivedParticipantsInfo(users:Array<Dynamic>)
	{
		_participents = users;
	}

	public function getParticipents():Array<Dynamic>
	{
		return _participents;
	}

	function handleMessageReceived(eventID:String, objType:String, data:Dynamic)
	{
		_otherConnected = true;
		var messageObject:Dynamic = Json.parse(data.message);
//		DebugConsole.getInstance().log('msg: '+ messageObject, false);

		if (Reflect.hasField(messageObject, HEIGHT_RATIO))
		{
			_gameController.setPlayerMeter(0, messageObject.heightRatio);
		}
		else if (Reflect.hasField(messageObject, LINES_RECEIVED))
		{
			_gameController.getLines(messageObject.linesReceived);
		}
		else if (Reflect.hasField(messageObject, PLAYER_LOST))
		{
			_gameController.otherPlayerLost(messageObject.playerLost);
		}
		else if (Reflect.hasField(messageObject, PLAYER_WON))
		{
			_gameController.gotWinnerPoints(messageObject.playerWon);
		}
		else if (Reflect.hasField(messageObject, START_GAME))
		{
			_gameController.opponentStartedGame();
		}
		else if (Reflect.hasField(messageObject, FORCE_START_GAME))
		{
			_gameController.opponentForceStartedGame();
		}
		else if (Reflect.hasField(messageObject, PAUSE_GAME))
		{
			_gameController.pauseGame(true);
		}
		else if (Reflect.hasField(messageObject, RESUME_GAME))
		{
			_gameController.pauseGame(true);
		}
		else if (Reflect.hasField(messageObject, POINTS))
		{
			_gameController.setOpponentPoints(Std.parseInt(messageObject.points));
		}
	}

	public function setUserData(key:String, value:String)
	{
		collabService.setUserApplicationData(key, value);
	}

	public function getUserData(key:String, callBack:String->String->Dynamic, defaultValue:Dynamic=null)
	{
		collabService.getUserApplicationData(key, callBack, defaultValue);
	}

	function getParticipantsInfo(callBack:Array<Dynamic>->Void):Void
	{
		collabService.getParticipants(function(users:Dynamic)
		{
//			DebugConsole.getInstance().log("others " + users, false);
			if(Std.is(users, Array))
			{
				callBack(users);
			}
			else
			{
				var usersArray:Array<Dynamic> = [];
				usersArray.push(users);
				callBack(usersArray);
			}
		});

	}

	public function sendHeightChanged(heightRatio:Float)
	{
		sendMessage(getHeightMessage(heightRatio));
	}

	public function sendPoints(points:Int)
	{
		sendMessage(getPointsMessage(points));
	}

	function sendMessage(message:String)
	{
		if (isOpponentConnected())
		{
			collabService.sendMessage(message);
		}
		else
		{
			messageQueue.push(message);
		}
	}

	public function sendStartGame(level:Int=1)
	{
		sendMessage(getSendStartGameMessage(level));
	}

	public function sendStartingGame()
	{
		sendMessage(getStartingGameMessage());
	}

	function getPointsMessage(points:Int):String
	{
		return Std.format('{ "$POINTS": "$points" }');
	}

	function getStartingGameMessage():String
	{
		return Std.format('{ "$FORCE_START_GAME": "true" }');
	}

	function getSendStartGameMessage(level:Int):String
	{
		return Std.format('{ "$START_GAME": "$level" }');
	}

	function linesShouldBeSent(numLines:Int)
	{
		sendMessage(getSendLinesMessage(numLines));
	}

	function getSendLinesMessage(numLines:Int):String
	{
		return Std.format('{ "$LINES_RECEIVED": $numLines }');
	}

	public function sendPause()
	{
		sendMessage( Std.format('{ "$PAUSE_GAME": "true"}'));
	}

	public function sendResume()
	{
		sendMessage( Std.format('{ "$RESUME_GAME": "true"}'));
	}

	public function announceLose()
	{
		sendMessage(getAnnounceLoseMessage());
	}

	function getAnnounceLoseMessage():String
	{
		var points = _gameController.getGameState().getPoints();
		return Std.format('{ "$PLAYER_LOST": "$points" }');
	}

	public function announceWinningStats()
	{
		sendMessage(getAnnounceWonMessage());
	}

	function getAnnounceWonMessage()
	{
		var points = _gameController.getGameState().getPoints();
		return Std.format('{ "$PLAYER_WON": $points }');
	}

	function getHeightMessage(heightRatio:Float):String
	{
		return Std.format('{ "$HEIGHT_RATIO": $heightRatio }');
	}

	public function isOpponentConnected():Bool
	{
		if (_participents.length > 0)
		{
			_otherConnected = true;
		}
		return _otherConnected;
	}
}

class OpponentInfo
{
	public var name:String;
	public var points:Int;
}