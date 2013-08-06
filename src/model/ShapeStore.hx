package model;
class ShapeStore
{
	inline static var e = TetrisBoard.EMPTY;
//	public inline static var colors = 		[ '' ,'' ,'' ,'' ,'' ,'#f4bd3a' ,'#6D87F3', '#DB8433'];
	public inline static var randomBlockColor:String = '#DB8433';
	public inline static var shapes:Array<ShapeData> =
	[
		new ShapeData([
			[e, e, e, e],
			[0, 0, 0, 0],
			[e, e, e, e]
		], "#cf64f1"),
		new ShapeData([
			[e, e, e],
			[1, 1, 1],
			[e, 1, e]
		], "#189af0", -0.5),
		new ShapeData([
			[e, 2],
			[2, 2],
			[2, e]
		], "#f45f76"),
		new ShapeData([
			[3, e],
			[3, 3],
			[e, 3]
		], "#8DD909"),
		new ShapeData([
			[e, e, e],
			[4, 4, 4],
			[e, e, 4]
		], "#2cc887", -0.5),
		new ShapeData([
			[e, e, e],
			[5, 5, 5],
			[5, e, e]
		], "#f4bd3a", -0.5),
		new ShapeData([
			[6, 6],
			[6, 6]
		], "#6D87F3")
	];

	public inline static function getLength():Int
	{
		return shapes.length;
	}

	public inline static function getShapeColor(shapeIndex):String
	{
		return shapeIndex < shapes.length ? shapes[shapeIndex].color : randomBlockColor;
	}
}

class ShapeData
{
	public var model:Array<Array<Int>>;
	public var color:String;
	public var offset:Float;

	public function new(model:Array<Array<Int>>, color:String, offset:Float=0)
	{
		this.model = model;
		this.color = color;
		this.offset = offset;
	}
}

