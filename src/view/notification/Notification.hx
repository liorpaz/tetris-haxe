package view.notification;
import util.JSUtil;
import view.DocElements;
import view.ScreenLayouter;
import js.Dom;
class Notification
{
	var text:String;
	var duration:Int;
	var layout:Layout;
	var view:HtmlDom;
	var label:HtmlDom;

    public function new(layout:Layout, text:String="", duration:Int=3000)
	{
		this.layout = layout;
		this.text = text;
		this.duration = duration;
		createView();
    }

	function createView()
	{
		view = DocElements.getNewElement('div', 'notification', 'notification');
		layout.applyToElement(view);
		label = JSUtil.createTextView('notificationText', text, "12px", 0, 0, 'h2');
		JSUtil.applyDimentions(label, layout.width, layout.height);
		view.appendChild(label);
	}
	public function setText(text:String)
	{
		label.innerHTML = text;
	}

	public function getView():HtmlDom
	{
		return view;
	}
}
