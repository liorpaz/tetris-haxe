package view.menu;
import view.SwitchBox;
import controller.ShapeController;
import util.JSUtil;
import haxe.Timer;
import model.Shape;
import model.ShapeStore;
import view.ShapeView;
import view.ScreenLayouter;
import model.TetrisBoard;
class WaitingForOpponentMenu extends Menu
{
	static inline var BLOCK_SIZE:Int = 30;

	var animation:SwitchBox;
	var timer:Timer;

	public function new(layout:Layout)
	{
		super(layout);
		timer = new Timer(1000);
		addItems();
		timer.run = onTick;
    }

	var animationIndex:Int = 0;
	function onTick()
	{
		if (animationIndex > 0)
		{
			JSUtil.setOpacity(animation.getView(), 1);
		}
		animation.setIndex(animationIndex % 2);
		animationIndex++;
	}

	function addItems()
	{
		var halfBlock = Std.int(BLOCK_SIZE * 0.5);
		var label = addLabel("Waiting for opponent...");
		container.add(label);

		animation = new SwitchBox("animation", "");

		var shapeData = getShapeData();
		animation.add(new ShapeView(new Shape(shapeData, 3), BLOCK_SIZE, BLOCK_SIZE).getView());
		shapeData.model = ShapeController.rotate(shapeData.model);
		animation.add(new ShapeView(new Shape(shapeData, 3), BLOCK_SIZE, BLOCK_SIZE).getView());

		container.add(animation.getView());
		JSUtil.setOpacity(animation.getView(), 0);
	}

	function getShapeData():ShapeData
	{
		return new ShapeData([
		[TetrisBoard.EMPTY, 2],
		[5, 4],
		[6, TetrisBoard.EMPTY]
		], "#f45f76");
	}
}
