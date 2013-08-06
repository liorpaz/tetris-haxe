package view.menu;

import util.JSUtil;
import util.JSUtil;
import view.DocElements;
import view.ScreenLayouter.Layout;
import js.Dom;

class ShareMenu extends Menu
{
	inline static var SHARE_BUTTON = 'shareButton';
	inline static var CANCEL_BUTTON = 'cancelButton';

	public var shareCallback:String->Void;
	public var cancelCallback:Void->Void;

	var shareButton:HtmlDom;
	var cancelButton:HtmlDom;
	var shareTextArea:HtmlDom;

	public function new(backgroundLayout:Layout)
	{
		super(backgroundLayout);
		createMenuItems();
	}

	function createMenuItems()
	{
		container.add(addLabel("Share the Fun"));
		shareTextArea = DocElements.getNewElement('textarea', 'shareTextArea', 'textArea');
		shareTextArea.innerHTML = "Share on facebook";
		JSUtil.applyDimentions(shareTextArea, _buttonLayout.width, _buttonLayout.height * 3);
		container.add(shareTextArea);
		shareButton = JSUtil.createButton('Share', SHARE_BUTTON, _buttonLayout, 'button greenButton', 0, 0, Menu.BUTTON_TEXT_SIZE);
		cancelButton = JSUtil.createButton('Cancel', CANCEL_BUTTON, _buttonLayout, 'button redButton', 0, 0, Menu.BUTTON_TEXT_SIZE);
		container.add(shareButton);
		container.add(cancelButton);
	}

	override function touchCallback(event:Dynamic)
	{
		if (removed) return;

		switch (event.target.id)
		{
			case SHARE_BUTTON + 'Hit':
				close();
				shareCallback(shareTextArea.innerHTML);
			case CANCEL_BUTTON + 'Hit':
				close();
				cancelCallback();
		}
	}
}
