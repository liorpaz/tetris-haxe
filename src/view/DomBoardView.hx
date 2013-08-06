package view;

import haxe.Timer;
import util.Point;
import util.AnimationUtil;
import view.DocElements;
import util.JSUtil;
import model.TetrisBoard;
import js.Lib;
import model.Shape;
import js.Dom;

import feffects.easing.Quint;

class DomBoardView implements BoardView
{
	inline static var ROW_FLASH_TIME:Int = 150;
	inline static var TOP_COVER_HEIGHT:Int = 12;
	inline static var TOP_COVER_COLOR:Int = 0xFFFFFF;

	var _modelWidth:Int;
	var _modelHeight:Int;
	var _blockWidth:Int;
	var _blockHeight:Int;
	var lastRotation:Float;

	var board:HtmlDom;
	var topCover:HtmlDom;
	var rows:Array<HtmlDom>;
	var previousShape:Shape;
	var shapeView:ShapeView;

	var _boardModel:TetrisBoard;
	var boardLeft:Int;

    public function new(boardModel:TetrisBoard, left:Int, top:Int, modelWidth:Int, modelHeight:Int, blockWidth:Int, blockHeight:Int)
	{
		_boardModel = boardModel;
		_modelWidth = modelWidth;
		_modelHeight = modelHeight;
		_blockWidth = blockWidth;
		_blockHeight = blockHeight;
		boardLeft = left;

		lastRotation = 0.0;

		board = DocElements.getNewElement("div", 'graphicsBoard', 'tetrisBoard');
		DocElements.mainElement.appendChild(board);
		JSUtil.applyLayout(board, left, top, _modelWidth * _blockWidth, _modelHeight * _blockHeight);

		createBlocksArray();
	}

	public function getView():HtmlDom
	{
		return board;
	}

	function createBlocksArray()
	{
		rows = [];
		addTopDivsToRows(_modelHeight, false);
	}

	function addTopDivsToRows(divNum:Int, pushDownRows:Bool=true)
	{
		for (i in (0...divNum))
		{
			var rowIndex = pushDownRows ? divNum - i - 1 : i;
			var rowElement = getRowElement(rowIndex * _blockHeight);
			if (pushDownRows)
			{
				rows.unshift(rowElement);
				board.insertBefore(rowElement, board.firstChild);
			}
			else
			{
				rows.push(rowElement);
				board.appendChild(rowElement);
			}

		}
	}

	var rowCounter:Int = 0;
	function getRowElement(rowTop:Int):HtmlDom
	{
		var id = 'row' + rowCounter++;
		var rowElement:HtmlDom = DocElements.getNewElement('div', id);
//		rowElement.style.backgroundColor = '#ff00ff';
		JSUtil.setPosition(rowElement, 0, rowTop);
		return rowElement;
	}

	public function updateShape(shape:Shape)
	{
		if (previousShape != shape)
		{
			if (shapeView == null)
			{
				addShape(shape);
				previousShape = shape;
			}
			else if (shapeView != null && previousShape.y >= 0)
			{
				removeShape();
				addShape(shape);
				previousShape = shape;
			}
		}
		else
		{
			moveShape(shape);
		}
	}

	function moveShape(shape:Shape)
	{
		shapeView.getView().style.left = JSUtil.cssPixels(shape.x * _blockWidth);
		shapeView.getView().style.top = JSUtil.cssPixels(shape.y * _blockHeight);
		if (lastRotation != shape.getRotation())
		{
			removeShape();
			addShape(shape);
		}
		lastRotation = shape.getRotation();
	}

	public function removeShape()
	{
		if (shapeView != null)
		{
			board.removeChild(shapeView.getView());
			shapeView = null;
		}
	}

	function addShape(shape)
	{
		shapeView = new ShapeView(shape, _blockWidth, _blockHeight);
		board.appendChild(shapeView.getView());
		lastRotation = 0;
	}

	public function addBottomLines(numLines:Int)
	{
		if (currentLinesBeingRemoved != null)
		{
			removeLinesInner();
		}
		removeTopRows(numLines);
		addBottomRows(numLines);
		shiftUpRows(numLines);
	}

	function shiftUpRows(numLines:Int)
	{
		var i = 0;
		for (row in rows)
		{
			var rowPosition = new Point(0, (i * _blockHeight));
			AnimationUtil.move(row, 500, rowPosition, feffects.easing.Expo.easeInOut, function(){
				row.style.top = JSUtil.cssPixels(Std.int(rowPosition.y));
			});
			i++;
		}
	}

	function addBottomRows(numLines:Int)
	{
		for (row in (_modelHeight - numLines)..._modelHeight)
		{
			var rowElement = getRowElement((row + numLines) * _blockHeight);
			rows.push(rowElement);
			board.appendChild(rowElement);
			for (column in 0..._modelWidth)
			{
				var color = _boardModel.getCell(column, row);
				if (color != TetrisBoard.EMPTY)
				{
					var block = new BlockView(column, row, color, _blockWidth, _blockHeight);
					block.getView().style.top = '0px';
					rowElement.appendChild(block.getView());
				}
			}
		}
	}

	function removeTopRows(numRows:Int)
	{
		for (i in 0...numRows)
		{
			board.removeChild(rows[0]);
			rows.splice(0, 1);
		}
	}

	function flashLines(lines:Array<Int>)
	{
		for (lineIndex in lines)
		{
			flash(rows[lineIndex]);
		}
	}

	function flash(element:HtmlDom)
	{
		AnimationUtil.fadeOut(element, ROW_FLASH_TIME, null, function(){
			AnimationUtil.fadeIn(element, ROW_FLASH_TIME, null, function(){
				AnimationUtil.fadeOut(element, ROW_FLASH_TIME);
			});
		});
	}

	var removeLinesTimer:Timer;
	var currentLinesBeingRemoved:Array<Int>;
	public function removeLines(removedLines:Array<Int>)
	{
		breakShapeToBlocks();
		removeShape();
		var numRemovedLines = removedLines != null ? removedLines.length : 0;
		if (numRemovedLines > 0)
		{
			flashLines(removedLines);
			if (currentLinesBeingRemoved != null)
			{
				removeLinesInner();
			}
			currentLinesBeingRemoved = removedLines;
			removeLinesTimer = new Timer(ROW_FLASH_TIME*3);
			var removeLinesWrapper = removeLinesInner;
			removeLinesTimer.run = removeLinesWrapper;
		}
	}

	function removeLinesInner()
	{
		removeLinesTimer.stop();
		removeLinesTimer = null;
		shiftRows(currentLinesBeingRemoved);
		currentLinesBeingRemoved.reverse();
		for (indexToRemove in currentLinesBeingRemoved)
		{
			board.removeChild(rows[indexToRemove]);
			rows.splice(indexToRemove, 1);
		}
		addTopDivsToRows(currentLinesBeingRemoved.length);
		currentLinesBeingRemoved = null;
	}

	function shiftRows(removedLines:Array<Int>)
	{
		for (lineIndex in removedLines)
		{
			shiftDownRows(1, lineIndex);
		}
	}

	function shiftDownRows(rowNum:Int, stopAtRow:Int)
	{
		for (rowIndex in 0...stopAtRow)
		{
			var row = rows[rowIndex];
			var rowTop = JSUtil.fromCssPixel(row.style.top);
			row.style.top = JSUtil.cssPixels(rowTop + rowNum * _blockHeight);
		}
	}

	function breakShapeToBlocks()
	{
		var rowIndex = previousShape.y;
		for (row in shapeView.getBlocksPerRow())
		{
			for (block in row)
			{
				if (block != null && rowIndex >= 0)
				{
					appendBlockToRow(block, rowIndex);
				}
			}
			rowIndex++;
		}
		rowIndex++;
	}

	function appendBlockToRow(block, rowIndex)
	{
		block.getView().style.left = JSUtil.cssPixels(JSUtil.fromCssPixel(block.getView().style.left));// - boardLeft);
		rows[rowIndex].appendChild(block.getView());
	}

	public function updateAllBoard()
	{
		if (shapeView != null)
		{
			removeShape();
		}
		for (row in rows)
		{
			var blockList = JSUtil.getElementsByClassName(row, 'block', 'div');
			for (i in 0... blockList.length)
			{
				row.removeChild(blockList[i]);
			}
		}
	}

	public function clear()
	{
		removeShape();
		updateAllBoard();
	}
	public function getWidth():Int
	{
		return JSUtil.fromCssPixel(board.style.width);
	}
}
