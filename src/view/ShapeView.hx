package view;

import model.ShapeStore;
import util.JSUtil;
import util.JSUtil;
import util.JSUtil;
import util.JSUtil;
import model.Shape;
import model.TetrisBoard;

import js.Dom;
import js.Lib;

class ShapeView {

	var blocks:Array<Array<BlockView>>;
	var doc:Document;
	var container:HtmlDom;
	var _blockWidth:Int;
	var _blockHeight:Int;
	var _model:Shape;
	var shapeData:ShapeData;

	public function new(shape:Shape, blockWidth:Int, blockHeight:Int)
	{
		doc = Lib.document;
		shapeData = shape.shapeData;

		blocks = [];
		_blockWidth = blockWidth;
		_blockHeight = blockHeight;
		for (row in 0...shape.getHeight())
		{
			blocks.push([]);
		}
		createShape(shape);
	}

	function createShape(shape:Shape)
	{
		var bits = shape.getBits();
		var w = bits.length;
		var h = bits[0].length;
		container = doc.createElement("div");
		container.id = 'shape';
		container.style.position = 'absolute';
		container.style.left = JSUtil.cssPixels(shape.x * (_blockWidth));
		container.style.top = JSUtil.cssPixels(shape.y * (_blockHeight));
		container.style.width = JSUtil.cssPixels(shape.getWidth() * _blockWidth);
		container.style.height = JSUtil.cssPixels(shape.getHeight() * _blockHeight);
		for (y in 0...h)
			for (x in 0...w)
				blocks[y].push(addBlock(x, y, bits[x][y]));
	}

	function addBlock(x:Int, y:Int, color:Int):BlockView
	{
		var block:BlockView = null;
		if (color != TetrisBoard.EMPTY)
		{
			block = new BlockView(x, y, color, _blockWidth, _blockHeight);
			container.appendChild(block.getView());
		}
		return block;
	}

	public function getView():HtmlDom
	{
		return container;
	}

	public function getBlocksPerRow():Array<Array<BlockView>>
	{
		for (row in blocks)
			for (block in row)
				setBlockOffset(block);
		return blocks;
	}

	function setBlockOffset(blockView:BlockView)
	{
		if (blockView != null)
		{
			var block:HtmlDom = (blockView.getView());
			var blockLeft = JSUtil.fromCssPixel(block.style.left);
			var containerLeft = JSUtil.fromCssPixel(container.style.left);
			block.style.left = JSUtil.cssPixels(containerLeft + blockLeft);
			block.style.top = '0px';
		}
	}

	public function getModelWidth():Int
	{
		return blocks[0].length;
	}

	public function getWidth():Int
	{
		return JSUtil.fromCssPixel(container.style.width);
	}

	public function getHeight():Int
	{
		return JSUtil.fromCssPixel(container.style.height);
	}

	public function getModel():Shape
	{
		return _model;
	}

	public function getShapeOffset():Float
	{
		return shapeData.offset;
	}
}