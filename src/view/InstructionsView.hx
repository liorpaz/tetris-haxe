package view;

import view.Assets;
import view.Assets;
import util.JSUtil;
import util.JSUtil;
import util.JSUtil;
import util.JSUtil;
import view.VBox;
import view.Box.Alignment;
import js.Dom;

class InstructionsView
{
	public static inline var PAGE = 'page';
	var switchBox:SwitchBox;
	var nextCloseSwitchBox:SwitchBox;
	var container:HBox;
	var _alignment:Alignment;
	var pageIndicator:PageIndicator;

	public function new(align:Alignment, width:Int, height:Int)
	{
		_alignment = align;
		createView(width, height);
    }

	function createView(width:Int, height:Int)
	{
		container = new HBox("instructionsContainer", '');
		switchBox = new SwitchBox('instructions', 'instructions');
		switchBox.setDimensions(width, height);
		switchBox.setHAlign(center);
		JSUtil.setPosition(switchBox.getView(), 0, 0);
		var ratio = 1.0;

		var inst1 = new VBox('inst1');
		inst1.setAlign(right);
		var image1 = Assets.instructions1.createElement();
		fitImage(image1, Std.int(width * 0.8), Std.int(height * 0.7));
		inst1.add(image1);
		var label1 = JSUtil.createTextView('', "Tap anywhere to rotate shapes", "20px", 0, 0, 'h2');
		JSUtil.setWidth(label1, Std.int(width * 0.9));
		inst1.add(label1);

		var inst2 = new VBox('inst2');
		inst2.setAlign(center);
		var image2 = Assets.instructions2.createElement();
		fitImage(image2, width, Std.int(height * 0.50));
		inst2.add(image2);
		var label2 = JSUtil.createTextView('', "Meter on the right shows opponent's height", "20px", 0, 0, 'h2');
		JSUtil.setWidth(label2, Std.int(width * 0.9));
		inst2.add(label2);

		var inst3 = new VBox('inst1');
		inst3.setAlign(center);
		var image3 = Assets.instructions3.createElement();
		fitImage(image3, width, Std.int(height * 0.50));
		inst3.add(image3);
		var label3 = JSUtil.createTextView('', "Remove 2 or more lines to send lines to your opponent", "20px", 0, 0, 'h2');
		JSUtil.setWidth(label3, Std.int(width * 0.9));
		inst3.add(label3);

		switchBox.addBox(inst1);
		switchBox.addBox(inst2);
		switchBox.addBox(inst3);
		switchBox.setIndex(0);

		container.addBox(switchBox);
		container.addFixed(getIconButton(Assets.closeButton, 'close'), 0, 0);

		nextCloseSwitchBox = new SwitchBox('nextCloseSwitchBox', '');
		// hack hack, hardoced values!
		nextCloseSwitchBox.setDimensions(38, 38);
		nextCloseSwitchBox.add(getIconButton(Assets.nextButton, 'next'));
		nextCloseSwitchBox.add(getIconButton(Assets.doneButton, 'close'));
		container.addFixed(nextCloseSwitchBox.getView(), width - 18 - 20, 0);

		pageIndicator = new PageIndicator('instructionPageIndicator', 3);
		container.addBoxFixed(pageIndicator.getView(), Std.int((width - pageIndicator.getWidth()) / 2), height - 25);
	}

	function getIconButton(iconInfo:ImageInfo, name:String):HtmlDom
	{
		var iconContainer = new VBox(name + 'IconContainer');
		iconContainer.setSpacing(10);
		JSUtil.setBGColor(iconContainer.getView(), 0x5Fa9f3);
		var icon = iconInfo.createElement();
		iconContainer.add(icon);
		var iconHitArea = DocElements.getNewElement('div', name + 'IconHitArea');
		JSUtil.applyDimentions(iconHitArea, iconInfo.width + 20, 20 + iconInfo.height);
		iconContainer.addFixed(iconHitArea, 0, 0);
		return iconContainer.getView();
	}

	function fitImage(image:HtmlDom, width:Int, height:Int)
	{
		var imageWidth = JSUtil.getWidth(image);
		var imageHeight = JSUtil.getHeight(image);
		var imageRatio = imageWidth / imageHeight;
		var containerRatio = width / height;
		if (imageRatio < containerRatio)
		{
			var newWidth = Std.int(height * imageRatio);
			JSUtil.applyDimentions(image, newWidth, height);
		}
		else
		{
			var newHeight = Std.int(width / imageRatio);
			JSUtil.applyDimentions(image, width, newHeight);
		}
	}

	public function hasNextPage():Bool
	{
		return switchBox.getIndex() < switchBox.getNumChildren() - 1;
	}

	public function gotoNextPage()
	{
		if (hasNextPage())
		{
			switchBox.setIndex(switchBox.getIndex() + 1);
			pageIndicator.setIndex(switchBox.getIndex());
			if (switchBox.getIndex() == switchBox.getNumChildren()-1)
			{
				nextCloseSwitchBox.setIndex(1);
			}
		}
	}

	public function getView():Box
	{
		return container;
	}
}
