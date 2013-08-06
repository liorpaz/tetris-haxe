package util;
class Point {
	public var x:Float;
	public var y:Float;

	public function new(x, y){
		this.x = x;
		this.y = y;
    }

	public function subtract(p:Point):Point
	{
		return new Point(x - p.x, y - p.y);
	}

	public function add(p:Point):Point
	{
		return new Point(x + p.x, y + p.y);
	}

	public function scalarMult(scalar:Float):Point
	{
		return new Point(x * scalar, y * scalar);
	}

	public function clone():Point
	{
		return new Point(x, y);
	}

	public function toString():String
	{
		return Std.format("[ $x, $y ]");
	}
}
