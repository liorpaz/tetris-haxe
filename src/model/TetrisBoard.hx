package model;

import util.ArrayUtil;

class TetrisBoard
{
	public static inline var PADDING:Int = 3;
	public static inline var PAD_COLOR:Int= 9;
	public static inline var EMPTY:Int = -1;
	public static inline var RANDOM_COLOR:Int = -2;

	var _boardWidth:Int;
	var _boardHeight:Int;
	var boardWidthWithPadding:Int;
	var boardHeightWithPadding:Int;

	var board:Array<Array<Int>>;

	public function new(boardWidth=10, boardHeight=21)
    {
		_boardWidth = boardWidth;
		_boardHeight = boardHeight;
		boardWidthWithPadding = _boardWidth + PADDING * 2;
		boardHeightWithPadding = _boardHeight + PADDING * 2;
		createBoard(_boardWidth, _boardHeight);
    }

	public function clear()
	{
		createBoard(_boardWidth, _boardHeight);
	}


	public function shapeHitTest(shape:Shape):Bool
	{
		var shapeBits = shape.getBits();
		for (j in 0...shape.getHeight())
		{
			for (i in 0...shape.getWidth())
			{
				if (shapeBits[i][j] != EMPTY && getCell(shape.x + i, shape.y + j) != EMPTY)
				{
					return true;
				}
			}
		}
		return false;
    }

    public function addShape(shape:Shape)
	{
		var shapeBits = shape.getBits();
		for (j in 0...shape.getHeight())
		{
			for (i in 0...shape.getWidth())
			{
				var bit = shapeBits[i][j];
				if (bit != EMPTY)
				{
					setCell(shape.x + i, shape.y + j, shapeBits[i][j]);
				}
			}
		}
	}

    public function removeShape(shape)
	{
		var shapeBits = shape.getBits();
		for (j in 0...shape.getHeight())
		{
			for (i in 0...shape.getWidth())
			{
				if (shapeBits[i][j] != EMPTY)
				{
					setCell(shape.x + i, shape.y + j, EMPTY);
				}
			}
		}
	}

	public function addRandomLines(numLines:Int, color:Int, currentShape:Shape)
	{
		removeShape(currentShape);
		board.splice(PADDING, numLines);
		for (i in 0...numLines)
		{
			board.insert(board.length - PADDING, getFullLine(color, true));
		}
		addShape(currentShape);
	}

    function setCell(x, y, color)
	{
    	assertInWidthRange(x);
    	assertInHeightRange(y);
		x = indexToBoard(x);
    	y = indexToBoard(y);
    	board[y][x] = color;
	}

	public function getTopLine(currentShape:Shape):Int
	{
		removeShape(currentShape);
		for (line in 0...board.length)
		{
			if (!checkLineEmpty(line))
			{
				addShape(currentShape);
				return line;
			}
		}
		addShape(currentShape);
		return 0;
	}

	function checkLineEmpty(lineIndex:Int):Bool
	{
		var lineBits = getLine(lineIndex);
		for (i in 0...lineBits.length)
		{
			if (!Lambda.exists([TetrisBoard.EMPTY, TetrisBoard.PAD_COLOR], function(bit){return bit == lineBits[i];}))
			{
				return false;
			}
		}
		return true;
	}

   	public function getCell(x, y):Int
	{
    	if (inWidthRange(x) && inHeightRange(y))
		{
    		x = indexToBoard(x);
    		y = indexToBoard(y);
    		return board[y][x];
		}
    	else
		{
    		throw "trying to get a cell out of range (#{x}, #{y})";
		}
		return -1;
	}

	public function removeFullLines(lines:Array<Int>)
	{
    	var result = [];
    	for (line in lines)
		{
    		if (checkAndRemoveLine(line))
			{
    			result.push(line);
			}
		}
    	return result;
	}

    function checkAndRemoveLine(line:Int):Bool
	{
		if (checkLineFull(line))
		{
			removeLine(line);
			return true;
		}
		return false;
	}

    function removeLine(lineIndex:Int)
    {
		assertInHeightRange(lineIndex);
		board.splice(lineIndex + PADDING, 1);
		board.insert(PADDING, getEmptyLine());
	}

	function checkLineFull(lineIndex):Bool
	{
		var lineBits = getLine(lineIndex);
		for (i in 0...lineBits.length)
		{
			if (Lambda.exists([TetrisBoard.EMPTY, TetrisBoard.PAD_COLOR], function(bit){return bit == lineBits[i];}))
			{
				return false;
			}
		}
		return true;
	}

    public function getLine(lineIndex):Array<Int>
    {
		var lineWithoutPadding = board[lineIndex + PADDING].concat([]);
		lineWithoutPadding.splice(0, PADDING);
		lineWithoutPadding.splice(lineWithoutPadding.length - PADDING, PADDING);
		return lineWithoutPadding;
	}

    function getEmptyLine():Array<Int>
	{
		return getFullLine(EMPTY);
	}

	function getFullLine(color:Int, random:Bool=false):Array<Int>
	{
		var line = new Array<Int>();
		var randomLine:Array<Int> = null;

		for (column in 0...PADDING)
			line.push(PAD_COLOR);
		if (random)
		{
			randomLine = getRandomLineModel(color);
		}
		for (column in 0..._boardWidth)
		{
			if (random)
			{
				color = randomLine[column];
			}
			line.push(color);
		}
		for (row in 0...PADDING)
			line.push(PAD_COLOR);
		return line;
	}

	function getRandomLineModel(color:Int)
	{
		var result:Array<Int> = [];
		var hasEmpty:Bool = false;
		for (i in 0..._boardWidth)
		{
			var fill:Bool = Math.floor(Math.random()*3) > 0;
			result.push(fill ? color : EMPTY);
			hasEmpty = hasEmpty || !fill;
		}
		if (!hasEmpty)
		{
			result[0] = color;
		}
		return result;
	}

    public function print()
    {
		trace ('the board: \n' + this.toString());
	}

    public function toString(padding:Bool=false):String
	{
		var result = '';
		var startY = padding ? 0 : PADDING;
		var endY =  boardHeightWithPadding - (padding ? 0 : PADDING);
		var startX = startY;
		var endX = boardWidthWithPadding - (padding ? 0 : PADDING);
		for (row in startY...endY)
		{
			var rowBits = board[row];

			result += (board[row].slice(startX, endX).join('')) + '\n';
		}
		return result;
	}

    function createBoard(boardWidth=10, boardHeight=21)
	{
		board = [];
		for (i in 0...boardHeightWithPadding)
		{
			board.push([]);
		}
		//   center
		for (row in 0...boardHeight + PADDING )
		{
			board[row] = getEmptyLine();
		}
		//    bottom padding
		for (y in boardHeight + PADDING...boardHeightWithPadding)
			for (x in 0...boardWidthWithPadding)
				board[y][x] = PAD_COLOR;
	}

	//helpers

    function assertInWidthRange(value, message=null)
	{
    	if (!inWidthRange(value))
    	throw "trying to access cell out of horizontal range (#{value})";
	}

    function assertInHeightRange(value, message=null)
	{
		if (!inHeightRange(value))
		throw "trying to access cell out of vertical range (#{value})";
	}

	function inWidthRange(value)
	{
		return value >= -PADDING && value < boardWidthWithPadding;
	}

	function inHeightRange(value)
	{
		return value >= -PADDING && value < boardHeightWithPadding;
	}

	function indexToBoard(value)
	{
		return value + PADDING;
	}

	//getters

    public function getWidth():Int
	{
		return _boardWidth;
	}

	public function getHeight():Int
    {
		return _boardHeight;
	}
}


