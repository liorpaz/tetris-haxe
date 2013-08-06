package rounds;

extern class Wasabi
{
	public function endApplication():Void;
	public function addEventListener(eventID:String, callBack:String->String->String->Void):Void;
	public function getCurrentUser(callbackFunc:Dynamic->Void):Void;
	public function getParticipants(callbackFunc:Dynamic->Void):Void; // should be array<users>
	public function getUserInfo(userID:String, fields:Array<String>, callbackFunc:Dynamic->Void):Void;
	public function getUserApplicationData(key:String, callbackFunc:String->String->Dynamic):Void;
	public function setUserApplicationData(key:String, value:Dynamic):Void;
	public function sendMessage(target:String, messageData:String):Void;
	public function start():Void;
	public static function create(id:String):Wasabi;
}
