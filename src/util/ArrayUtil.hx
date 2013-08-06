package util;
class ArrayUtil {

    public static function range(start:Int, end:Int):Array<Int>
	{
		var result = [];
		var i=start;
		while (i <= end)
		{
			result.push(i++);
		}
		return result;
	}

	public static function deepArrayToString(array:Array<Dynamic>):String
	{
		var result = '';
		for (line in array)
		{
			result += line.toString() + '\n';
		}
		return result;
	}

	public static function get2dArray(width:Int, height:Int, initValue:Dynamic):Array<Array<Dynamic>>
	{
		var result = [];
		var tempLine;
		for (y in 0...width)
		{
			tempLine = [];
			for (x in 0...height)
			{
				tempLine.push(initValue);
			}
			result.push(tempLine);
		}
		return result;
	}
}
