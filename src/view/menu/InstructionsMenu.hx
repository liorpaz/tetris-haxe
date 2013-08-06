package view.menu;

import util.JSUtil;
import view.InstructionsView;
import view.ScreenLayouter.Layout;

class InstructionsMenu extends Menu
{
	public var closeCallback:Void->Void;
	var instructionsView:InstructionsView;

	public function new(layout:Layout)
	{
		super(layout);
		createView();
    }

	function createView()
	{
		instructionsView = new InstructionsView(center, _popupLayout.width, _popupLayout.height);
		container.setVAlign(top);
		container.setSpacingY(0);
		container.addBox(instructionsView.getView());
	}

	override function touchCallback(event:Dynamic)
	{
		var closePressed = event.target.id == 'closeIconHitArea';
		if (instructionsView.hasNextPage() && !closePressed)
		{
			instructionsView.gotoNextPage();
		}
		else
		{
			closeCallback();
		}
	}
}
