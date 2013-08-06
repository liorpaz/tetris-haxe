package view;
import util.JSUtil;
import util.JSUtil;
import util.JSUtil;
import util.JSUtil;
import js.Dom;
import js.Lib;

class NextShapePreview {

	inline static var PADDING:Int = 2;

	var _blockWidth:Int;
	var _blockHeight:Int;
	var preview:HtmlDom;
	var shapeView:ShapeView;

	public function new(width:Int, height:Int)
	{
		var doc = Lib.document;

		_blockWidth = Std.int((width - PADDING) / 4);
		_blockHeight = Std.int((height - PADDING) / 4);
		preview = doc.createElement("div");
		preview.id = 'preview';
		preview.className = 'preview circle';
		preview.style.position = 'absolute';
		JSUtil.applyDimentions(preview, width, height);
	}

//	function drawBackground(width, height)
//	{
//		var canvas = JSUtil.createCanvas(preview, 0, 0, width, height);
//		var ctx:Dynamic = canvas.getContext("2d");
//		ctx.beginPath();
//		ctx.arc(Std.int(width / 2), Std.int(height / 2), width / 2, 0, 2 * Math.PI, false);
//		ctx.fillStyle = '#000';
//		ctx.fill();
//	}

	public function updateShape(shape)
	{
		if (shapeView != null)
		{
			preview.removeChild(shapeView.getView());
		}
		shapeView = new ShapeView(shape, _blockWidth-2, _blockHeight-2);
		preview.appendChild(shapeView.getView());
		centerShape();
	}

	function centerShape()
	{
		var shape = shapeView.getView();
		var x = Std.int((JSUtil.getWidth(preview) - JSUtil.getWidth(shape)) / 2);
		var y = PADDING + Std.int((JSUtil.getHeight(preview) - JSUtil.getHeight(shape)) / 2);

		// center the shape in the preview area
		x += Std.int(_blockWidth * shapeView.getShapeOffset());

		shape.style.left = JSUtil.cssPixels(x);
		shape.style.top = JSUtil.cssPixels(y);
	}

	public function getView():HtmlDom
	{
		return preview;
	}
}