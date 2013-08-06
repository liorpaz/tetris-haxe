package model;

import model.ShapeStore;
class Shape
{

	public var x:Int;
	public var y:Int;
	public var color:Int;
	public var rotation:Float;

	public var shapeData:ShapeData;

	public function new(shapeData:ShapeData, color:Int)
	{
		x = 0;
		y = 0;
		rotation = 0;
		this.color = color;
		this.shapeData = shapeData;
	}

	public function getBits():Array<Array<Int>>
	{
		return shapeData.model;
	}

	public function getWidth():Int
	{
		return shapeData.model.length;
	}

	public function getHeight():Int
	{
		return shapeData.model[0].length;
	}

	public function setRotation(value)
	{
		rotation = value;
	}

	public function getRotation():Float
	{
		return rotation;
	}

//	function clone()
//	{
//		var copy = new Shape(deepClone(shapeBits), color);
//		copy.x = x;
//		copy.y = y;
//		copy.rotation = rotation;
//	}
}