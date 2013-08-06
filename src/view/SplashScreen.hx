package view;

import js.JQuery;
import util.AnimationUtil;
import js.Dom;
import view.ScreenLayouter;

class SplashScreen
{
	var container:VBox;

	public function new(layout:Layout)
	{
		Assets.preload([ Assets.instructions1, Assets.instructions2, Assets.instructions3 ]);
		container = new VBox('splash', 'splashScreen');
		container.setFixedWidth(layout.width);
		var innerContainer = new HBox('innerSplash', 'splashScreen');
		innerContainer.setFixedHeight(layout.height);
		container.setAlign(center);
		innerContainer.setAlign(center);
		layout.applyToElement(innerContainer.getView());
		layout.applyToElement(container.getView());
		var logo = Assets.skyTumblerLogo.createElement();
		innerContainer.add(logo);
		container.addBox(innerContainer);
    }

	public function show()
	{
		DocElements.splashElement.appendChild(container.getView());
	}

	public function close()
	{
		new JQuery(DocElements.splashNameHash).animate({opacity: 0.0}, 1, function()
		{
			DocElements.body.removeChild(DocElements.splashElement);
			container = null;
		});
	}
}
