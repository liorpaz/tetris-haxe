package view;
import util.JSUtil;
import model.Shape;
import model.TetrisBoard;
import js.Lib;
import js.Dom;
class StringBoardView implements BoardView
{
	var _boardModel:TetrisBoard;
	var _modelWidth:Int;
	var _modelHeight:Int;

	var board:Textarea;
	var boardContainer:HtmlDom;
	var doc:Document;

	public function new(boardModel:TetrisBoard, modelWidth:Int, modelHeight:Int, blockWidth:Int, blockHeight:Int)
	{
		doc = Lib.document;
		_boardModel = boardModel;
		_modelWidth = modelWidth;
		_modelHeight = modelHeight;

		board = cast doc.createElement('textarea');
		board.setAttribute('id', 'textBoard');
		boardContainer = doc.getElementById('mainContainer');
		boardContainer.appendChild(board);

		board.cols = modelWidth;
		board.rows = modelHeight;
		board.style.fontFamily = 'courier';
		boardContainer.style.width = board.style.width;
		boardContainer.style.height = board.style.width;
	}

	function update(shape:Shape)
	{
		board.value = _boardModel.toString(false);
	}

	public function getView():HtmlDom
	{
		return boardContainer;
	}

	public function updateShape(shape:Shape)
	{
		update(null);
	}

	public function addBottomLines(numLines:Int):Void
	{

	}

	public function removeLines(removedLines:Array<Int>)
	{
		update(null);
	}

	public function updateAllBoard()
	{
		update(null);
	}

	public function clear()
	{
		updateAllBoard();
	}

	public function getWidth():Int
	{
		return JSUtil.fromCssPixel(board.style.width);
	}

}



