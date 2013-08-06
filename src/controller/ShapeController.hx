package controller;
import util.ArrayUtil;
import model.Shape;
import model.TetrisBoard;
class ShapeController
{
	var _board:TetrisBoard;
	public var _currentShape:Shape;

	public function new(board:TetrisBoard)
	{
		_board = board;
    }

	public function getCurrentShape():Shape
	{
		return _currentShape;
	}

	public function addNewShape(shape)
	{
		_currentShape = shape;
		_currentShape.x = Math.round(_board.getWidth() / 2 - _currentShape.getWidth() / 2);
		_currentShape.y = -1;
		if (!_board.shapeHitTest(_currentShape))
		{
			_board.addShape(_currentShape);
			return true;
		}
		return false;
	}

	public function removeCurrentShape()
	{
		_board.removeShape(_currentShape);
	}

	public function moveDown():Bool
	{
		return move(0, 1);
	}

	public function moveLeft():Bool
	{
		return move(-1, 0);
	}

	public function moveRight():Bool
	{
		return move(1, 0);
	}

	public function move(x:Int, y:Int):Bool
	{
		_board.removeShape(_currentShape);
		_currentShape.x = _currentShape.x + x;
		_currentShape.y = _currentShape.y + y;
		if (!_board.shapeHitTest(_currentShape))
		{
			_board.addShape(_currentShape);
			return true;
		}
		_currentShape.x = _currentShape.x - x;
		_currentShape.y = _currentShape.y - y;
		_board.addShape(_currentShape);
		return false;
	}

	public function rotateRight():Bool
	{
		var shapeWidth = _currentShape.getWidth();
		var shapeHeight = _currentShape.getHeight();
		removeCurrentShape();
		_currentShape.shapeData.model = rotate(_currentShape.shapeData.model);
		if (!_board.shapeHitTest(_currentShape))
		{
			_board.addShape(_currentShape);
			_currentShape.setRotation((_currentShape.getRotation() + 90) % 360);
			return true;
		}
		_currentShape.shapeData.model = rotate(rotate(rotate(_currentShape.shapeData.model)));
		_board.addShape(_currentShape);
		return false;
	}

	public static function rotate(bits:Array<Array<Int>>):Array<Array<Int>>
	{
		var result = new Array<Array<Int>>();
		var w = bits.length;
		var h = bits[0].length;
		var tempLine = [];

		result = cast ArrayUtil.get2dArray(h, w, TetrisBoard.EMPTY);

		for (y in 0...h)
		{
			for (x in 0...w)
			{
				result[h-1-y][x] = bits[x][y];
			}
		}
		return result;
	}
}