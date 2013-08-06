package view;

import model.Shape;
import model.TetrisBoard;
import js.Dom;

interface BoardView {
	function getView():HtmlDom;
	function updateShape(shape:Shape):Void;
	function addBottomLines(numLines:Int):Void;
	function removeLines(removedLines:Array<Int>):Void;
	function updateAllBoard():Void;
	function clear():Void;
	function getWidth():Int;
}
