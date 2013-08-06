package connection.wasabi;

import rounds.Wasabi;
import connection.RoundsConsts;
import connection.ICollabService;

class WasabiWrapper implements ICollabService
{
	static inline var APP_ID:String = "4";

	static var wasabi:Wasabi;
	static var instance:WasabiWrapper;

	static var userName:String;

	function new()
	{
	}

    public static function getInstance():WasabiWrapper
	{
		if (instance == null)
		{
			wasabi = untyped {__js__('rounds.wasabi.create("4")');};
			instance = new WasabiWrapper();
		}
		return instance;
    }

	public function connect()
	{
		wasabi.start();
	}

	public function disconnect()
	{
		wasabi.endApplication();
	}

	public function sendMessage(message:String, target:String=RoundsConsts.ALLSESSIONUSERS)
	{
		wasabi.sendMessage(target, message);
	}

	public function addEventListener(eventID:String, callBack:String->String->String->Void)
	{
		wasabi.addEventListener(eventID, callBack);
	}

	public function getUserApplicationData(key:String, callBack:String->String->Dynamic, defaultValue:Dynamic=null):Void
	{
		// todo: take care of default if no value exists
		wasabi.getUserApplicationData(key, callBack);
	}

	public function getCurrentUser(callBack:Dynamic->Void):Void
	{
		wasabi.getCurrentUser(callBack);
	}

	public function getUserInfo(userID:String, attributes:Array<String>, callBack:Array<Dynamic>->Void)
	{
		wasabi.getUserInfo(userID, attributes, callBack);
	}

	public function getParticipants(callBack:Dynamic->Void)
	{
		wasabi.getParticipants(callBack);
	}

	public function setUserApplicationData(key:String, value:Dynamic):Void
	{
		wasabi.setUserApplicationData(key, value);
	}
}