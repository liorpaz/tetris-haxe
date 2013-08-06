package util;

import feffects.Tween;

import js.Dom;

class AnimationUtil {

    public function new()
	{
    }

	public static inline function fadeIn(element:HtmlDom, time,
										updateCallback:Float->Void=null,
										finishedCallback:Void->Void=null,
										endOpacity:Float=1)
	{
		var fadeTween = new Tween(0, endOpacity, time);
		fadeTween.onUpdate(function(value:Float){
			JSUtil.setOpacity(element, value);
			if (updateCallback != null)
			{
				updateCallback(value);
			}
		});
		if (finishedCallback != null)
		{
			fadeTween.onFinish(finishedCallback);
		}
		fadeTween.start();
	}

	public static inline function fadeOut(element:HtmlDom, time:Int, updateCallback:Float->Void=null, finishedCallback:Void->Void=null, start:Float=1)
	{
		var fadeTween = new Tween(start, 0, time);
		fadeTween.onUpdate(function(value:Float){
			JSUtil.setOpacity(element, value);
			if (updateCallback != null)
			{
				updateCallback(value);
			}
		});
		if (finishedCallback != null)
		{
			fadeTween.onFinish(finishedCallback);
		}
		fadeTween.start();
	}

	public static inline function move(element:HtmlDom, time:Int, position:Point, easing:Float->Float->Float->Float->Float=null,
										   finishedCallback:Void->Void=null):Tween
	{
		var originalPosition:Point = JSUtil.getPosition(element);
		var delta:Point = position.subtract(originalPosition);
		var moveTween = new Tween(0, 1, time, easing);

		moveTween.onUpdate(function(value:Float){
			var p:Point = originalPosition.add(delta.scalarMult(value));
			JSUtil.setPosition(element, Std.int(p.x), Std.int(p.y));
		});

		if (finishedCallback != null)
		{
			moveTween.onFinish(finishedCallback);
		}
		moveTween.start();
		return moveTween;
	}

	public static inline function changeSize(element:HtmlDom, time:Int, width:Int, height:Int, easing:String="easeOut",
									   finishedCallback:Void->Void=null)
	{
		var originalWidth:Int = JSUtil.getWidth(element);
		var originalHeight:Int = JSUtil.getHeight(element);
		var deltaWidth:Int = width - originalWidth;
		var deltaHeight:Int = height - originalHeight;
		var sizeTween = new Tween(0, 1, time, easing);

		sizeTween.onUpdate(function(value:Float){
			JSUtil.applyDimentions(element, Std.int(originalWidth + deltaWidth * value),
			Std.int(originalHeight + deltaHeight * value));

		});

		if (finishedCallback != null)
		{
			sizeTween.onFinish(finishedCallback);
		}
		sizeTween.start();
	}


}
