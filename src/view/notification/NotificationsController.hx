package view.notification;
import util.Point;
import util.AnimationUtil;
import util.JSUtil;
import util.JSUtil;
import haxe.Timer;
import view.ScreenLayouter;
import view.DocElements;
class NotificationsController
{
	static inline var NOTIFICATION_DURATION:Int = 4000;

	var notification:Notification;
	var layout:Layout;
	var notificationTimer:Timer;

    public function new(layout:Layout)
	{
		this.layout = layout;
		notification = new Notification(layout);
    }

	public function showNotification(text:String)
	{
		if (notificationTimer != null)
		{
			removeNotification(false);
		}
		notification.setText(text);
		layout.applyToElement(notification.getView());
		var notificationHeight = JSUtil.getHeight(notification.getView());
		var endPosition = JSUtil.getPosition(notification.getView());
		JSUtil.setY(notification.getView(), Std.int(endPosition.y) - notificationHeight);
		DocElements.body.appendChild(notification.getView());
		AnimationUtil.move(notification.getView(), 300, endPosition);

		notificationTimer = new Timer(NOTIFICATION_DURATION);
		notificationTimer.run = function(){removeNotification();};
	}

	public function removeNotification(animation:Bool=true)
	{
		if (notificationTimer != null)
		{
			notificationTimer.stop();
			notificationTimer = null;
		}
		if (notification == null)
		{
			return;
		}
		if (animation)
		{
			var endPosition = JSUtil.getPosition(notification.getView());
			var notificationHeight = JSUtil.getHeight(notification.getView());
			endPosition.y -= notificationHeight;
			AnimationUtil.move(notification.getView(), 300, endPosition, null,
			removeNotificationFromParent);
		}
		else
		{
			removeNotificationFromParent();
		}
	}

	function removeNotificationFromParent()
	{
		if (notification.getView().parentNode != null)
		{
			DocElements.body.removeChild(notification.getView());
		}
	}

}
