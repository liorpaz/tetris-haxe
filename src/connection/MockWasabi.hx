package connection;
import haxe.Json;
import haxe.Timer;

import connection.ConnectionController;

class MockWasabi implements ICollabService
{
	static inline var APP_ID:String = "0";

	static var instance:MockWasabi;

	static var userName:String;

	var eventCallbacks:Hash<String->String->Dynamic->Void>;

	var userData:Hash<String>;

	function new()
	{
		eventCallbacks = new Hash();
		userData = new Hash();
		userData.set(ConnectionController.HIGH_SCORE, '999999');
	}

	public static function getInstance():MockWasabi
	{
		if (instance == null)
		{
			instance = new MockWasabi();
		}
		return instance;
	}

	public function connect()
	{
//		runAfter(RoundsConsts.CONNECTED, 'data!', 100);
	}

	function runAfter(event:String, data:Dynamic, time:Int=5000)
	{
		var timer:Timer = new Timer(time);
		timer.run = function(){timer.stop(); eventCallbacks.get(event)(RoundsConsts.CONNECTED, 'dataType' , data);};
	}

	public function disconnect()
	{
	}

	public function getCurrentUser(callBack:Dynamic->Void):Void
	{
		callBack({ id: "999"});
	}

	public function sendMessage(message:String, target:String=RoundsConsts.ALLUSERS)
	{
		var messageObject = Json.parse(message);
		var key:String;
		var value:Dynamic;
		var time = 1;
		if (Reflect.hasField(messageObject, ConnectionController.HEIGHT_RATIO))
		{
			key = ConnectionController.HEIGHT_RATIO;
			value = messageObject.heightRatio;
		}
//		else if (Reflect.hasField(messageObject, ConnectionController.LINES_RECEIVED))
//		{
//			key = ConnectionController.LINES_RECEIVED;
//			value = messageObject.linesReceived;
//			time = 3000;
//		}
//		else if (Reflect.hasField(messageObject, ConnectionController.PAUSE_GAME))
//		{
//			key = ConnectionController.PAUSE_GAME;
//			value = messageObject.pauseGame;
//			time = 3000;
//
//		}
		else if (Reflect.hasField(messageObject, ConnectionController.RESUME_GAME))
		{
			key = ConnectionController.RESUME_GAME;
			value = messageObject.resumeGame;
			time = 3000;
		}
		else
		{
			return;
		}

		var jsonMessage = Json.parse('{"message": "xxx"}');
		var msg = Std.format('{ {"$key": $value}, {"from": "999"} }');
		jsonMessage.message = msg;
		runAfter(RoundsConsts.MESSAGE_RECEIVED, jsonMessage, time);
	}

	public function addEventListener(eventID:String, callBack:String->String->Dynamic->Void)
	{
		eventCallbacks.set(eventID, callBack);
	}

	public function getUserInfo(userID:String, attributes:Array<String>, callBack:Dynamic->Void)
	{
		var user:Dynamic = { id: '111', displayName: 'Mr. shmister man' };
		callBack(user);
	}

	public function getParticipants(callBack:Array<Dynamic>->Void)
	{
		var user:Dynamic = { id: '111', displayName: 'Mr. shmister man' };
		callBack([ user ]);
	}

	public function getUserApplicationData(key:String, callBack:String->String->Dynamic, defaultValue:Dynamic=null):Void
	{
		if (userData.exists(key))
		{
			callBack(key, userData.get(key));
		}
		else
		{
			callBack(key, defaultValue);
		}
	}

	public function setUserApplicationData(key:String, value:Dynamic):Void
	{
		userData.set(key, value);
	}
}
