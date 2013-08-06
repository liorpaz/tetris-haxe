package connection;

interface ICollabService
{
	public function connect():Void;
	public function disconnect():Void;
	public function sendMessage(message:String, target:String=ALLUSERS):Void;
	public function addEventListener(eventID:String, callBack:String->String->String->Void):Void;
	public function getCurrentUser(callBack:Dynamic->Void):Void;
	public function getUserApplicationData(key:String, callBack:String->String->Dynamic, defaultValue:Dynamic=null):Void;
	public function setUserApplicationData(key:String, value:Dynamic):Void;
	public function getUserInfo(userID:String, attributes:Array<String>, callBack:Array<Dynamic>->Void):Void;
	public function getParticipants(callBack:Dynamic->Void):Void;
}
