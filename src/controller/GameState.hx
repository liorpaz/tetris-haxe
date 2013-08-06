package controller;
class GameState
{
	static inline var INIT_INTERVAL:Int = 700;
	static inline var MS_PER_LEVEL:Int = 20;

	var _linesPerLevel:Int = 0;
	var _intervalMS:Int = 0;
	var _lines:Int = 0;
	var _level:Int = 1; // 1 based index
	var _points:Int = 0;
	var _initialLevel:Int = 0;
	var _highScore:Int = 0;
	var _playerName:String = "";
	var _opponentName:String = "";
	var _opponentPoints:Int = 0;
	var _opponentRatio:Float = 0;

	public var state:State;

	public function new(linesPerLevel:Int)
	{
		_linesPerLevel = linesPerLevel;
		_intervalMS = INIT_INTERVAL;
		state = beforeGame;
    }

	public function setInitialLevel(value:Int)
	{
		_initialLevel = value;
		_level = value;
		updateInterval();

	}

	public function setHighScore(value:Int)
	{
		if (value > _highScore)
		{
			_highScore = value;
		}
	}

	public function getHighScore():Int
	{
		return _highScore;
	}

	public function initLines()
	{
		_lines = 0;
		_points = 0;
	}

	public function addPoints(points:Int)
	{
		_points += points;
	}
	
	public function addLines(lines:Int)
	{
		_lines += lines;
		_points += switch (lines)
		{
			case 1:
				10;
			case 2:
				25;
			case 3:
				50;
			case 4:
				80;
			default:
				0;
		}
		_level = Math.floor(_lines / _linesPerLevel) + _initialLevel;
		updateInterval();
	}

	function updateInterval()
	{
		_intervalMS = INIT_INTERVAL - Math.round(_level * MS_PER_LEVEL);
	}

	public function getLevel():Int
	{
		return _level;
	}

	public function getLines():Int
	{
		return _lines;
	}

	public function getPoints():Int
	{
		return _points;
	}

	public function getIntervalMs():Int
	{
		return _intervalMS;
	}

	public function setPlayerName(value:String)
	{
		_playerName = value;
	}

	public function getPlayerName():String
	{
		return _playerName;
	}

	public function setOpponentName(value:String)
	{
		_opponentName = value;
	}

	public function getOpponentName():String
	{
		return _opponentName;
	}

	public function setOpponentPoints(value:Int)
	{
		_opponentPoints = value;
	}

	public function getOpponentPoints():Int
	{
		return _opponentPoints;
	}

	public function getInGame():Bool
	{
		return state == inGame;
	}

	public function getOpponentRatio():Float
	{
		return _opponentRatio;
	}

	public function setOpponentRatio(value:Float)
	{
		_opponentRatio = value;
	}

}

enum State
{
	beforeGame;
	inGame;
	paused;
	playerLost;
	playerWon;
}