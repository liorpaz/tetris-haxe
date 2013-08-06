package view;
import js.Dom;
class PageIndicator
{
	inline static var PADDING = 5;
	var container:HBox;
	var indicators:Array<PageDot>;
	var currentIndex:Int = 0;

    public function new(id:String, numPages:Int)
	{
		container = new HBox(id, '');
		container.setAlign(top);
		container.setPadding(PADDING);

		indicators = [];
		for (i in 0...numPages)
		{
			var indicator = new PageDot();
			indicators.push(indicator);
			container.addBox(indicator.getBox());
		}
		indicators[0].setState(1);
    }

	public function setIndex(index:Int)
	{
		if (index == currentIndex || index >= indicators.length || index < 0)
		{
			return;
		}
		indicators[currentIndex].setState(0);
		indicators[index].setState(1);
		currentIndex = index;
	}

	public function getWidth():Int
	{
		return Assets.emptyCircle.width * indicators.length + PADDING * indicators.length - 1;
	}

	public function getView():Box
	{
		return container;
	}
}

class PageDot
{
	var container:SwitchBox;

	public function new()
	{
		container = new SwitchBox('pageDot', '');
		container.add(Assets.emptyCircle.createElement());
		container.add(Assets.fullCircle.createElement());
		container.setDimensions(Assets.emptyCircle.width, Assets.emptyCircle.height);
	}

	public function setState(state:Int)
	{
		container.setIndex(state);
	}

	public function getBox():Box
	{
		return container;
	}
}
