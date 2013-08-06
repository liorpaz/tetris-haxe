package view;
import util.JSUtil;
import util.JSUtil;
import util.JSUtil;
import view.ScreenLayouter;
import js.Dom;
class CloudController{

	var topClouds:HtmlDom;
	var rightClouds:HtmlDom;
	var leftClouds:HtmlDom;
	var bottomClouds:HtmlDom;

	var _layout:Layout;
	var _parent:HtmlDom;

	public function new(layout:Layout, parent:HtmlDom)
	{
		_layout = layout;
		_parent = parent;
    }

	public function createClouds()
	{
		var x:Int;
		var y:Int;

		topClouds = JSUtil.setupImage(Assets.cloudsTop.createElement());
		x = Std.int(_layout.width / 2 - JSUtil.getWidth(topClouds) / 2);
		JSUtil.setPosition(topClouds, x, 0);
		_parent.appendChild(topClouds);

		rightClouds = JSUtil.setupImage(Assets.cloudsRight.createElement());
		x = _layout.width - JSUtil.getWidth(rightClouds);
		y = Std.int(_layout.height / 2 - JSUtil.getHeight(rightClouds) / 2);
		JSUtil.setPosition(rightClouds, x, y);
		JSUtil.setOpacity(rightClouds, 0.4);
		_parent.appendChild(rightClouds);

		bottomClouds = JSUtil.setupImage(Assets.cloudsBottom.createElement());
		var bottomHeight = JSUtil.getHeight(bottomClouds);
		y = _layout.height - bottomHeight;
		JSUtil.applyLayout(bottomClouds, 0, y, _layout.width, bottomHeight);
		_parent.appendChild(bottomClouds);

		leftClouds = JSUtil.setupImage(Assets.cloudsLeft.createElement());
		y = Std.int(_layout.height / 2 - JSUtil.getHeight(leftClouds) / 2);
		JSUtil.setPosition(leftClouds, 0, y);
		_parent.appendChild(leftClouds);
	}
}
