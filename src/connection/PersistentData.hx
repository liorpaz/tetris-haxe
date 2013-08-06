package connection;
class PersistentData
{
	var _connectionController:ConnectionController;

    public function new(connectionController:ConnectionController)
	{
		_connectionController = connectionController;
    }

	public function setProperty(key:String, value:String)
	{
		_connectionController.setUserData(key, value);
	}

	public function getProperty(key:String, callBack:String->String->Dynamic)
	{
		_connectionController.getUserData(key, callBack);
	}
}
