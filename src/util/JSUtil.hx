package util;

import util.JSUtil;
import js.JQuery;
import view.DocElements;
import util.JSUtil;
import view.ScreenLayouter;
import view.Assets;
import js.Dom;
import js.Lib;
import js.Dom;

class JSUtil {

	public static inline function isUndefined(value : Dynamic)
	{
		return untyped __js__('"undefined" === typeof value');
	}

	inline public static function cssPixels(value:Int):String
	{
		return Std.string(value) + 'px';
	}

	inline public static function cssPixelsFloat(value:Float):String
	{
		return Std.string(Std.int(value)) + 'px';
	}

	inline public static function fromCssPixel(value:String):Int
	{
		return Std.parseInt(value);
	}

	inline public static function cssHexColor(color:Int):String
	{
		return '#' + StringTools.hex(color, 6);
	}

	inline public static function rgbaString(color:Int, alpha:Float):String
	{
		return Std.format("rgba(${(color >> 16) & 0xFF},${(color >> 8) & 0xFF},${color & 0xFF},$alpha)");
	}

	inline public static function getElementsByClassName(root:HtmlDom, className:String, tagName:String="*"):Array<HtmlDom>
	{
		var elements:HtmlCollection<HtmlDom> = root.getElementsByTagName(tagName);
		var result:Array<HtmlDom> = [];
		for (i in 0...elements.length) {
			if((' ' + elements[i].className + ' ').indexOf(' ' + className + ' ')
			> -1) {
				result.push(elements[i]);
			}
		}
		return result;
	}

	inline public static function createCanvas(element:HtmlDom, x:Int, y:Int, w:Int, h:Int):Dynamic
	{
		var doc = Lib.document;
		var canvas = doc.createElement("canvas");
		canvas.setAttribute("width", JSUtil.cssPixels(w));
		canvas.setAttribute("height", JSUtil.cssPixels(h));
		var style:String = Std.format("position: fixed; left: ${x}; top: ${y};");
		canvas.setAttribute("style", style);
		canvas.style.position = 'absolute';
		element.appendChild(canvas);
		return canvas;
	}

	inline public static function getWidth(e:HtmlDom):Int
	{
		if (e.parentNode == null)
		{
//			var savedVisibility = e.style.visibility;
//			e.style.visibility = 'hidden';
//			DocElements.body.appendChild(e);
			var width = fromCssPixel(e.style.width);
//			DocElements.body.removeChild(e);
//			e.style.visibility = savedVisibility;
			return width;
		}
		else
		{
			return e.offsetWidth;
		}
	}

	inline public static function setWidth(e:HtmlDom, width:Int)
	{
		e.style.width = cssPixels(width);
	}

	inline public static function setHeight(e:HtmlDom, height:Int)
	{
		e.style.height = cssPixels(height);
	}

	inline public static function setVisibility(e:HtmlDom, value:Bool)
	{
		e.style.visibility = value ? 'visible' : 'hidden';
	}

	inline public static function getHeight(e:HtmlDom):Int
	{
		if (e.parentNode == null)
		{
			var savedVisibility = e.style.visibility;
			e.style.visibility = 'hidden';
			DocElements.body.appendChild(e);
			var height = fromCssPixel(e.style.height);
			DocElements.body.removeChild(e);
			e.style.visibility = savedVisibility;
			return height;
		}
		else
		{
			return e.offsetHeight;
		}
	}

	inline public static function getPosition(e:HtmlDom):Point
	{
		return new Point(JSUtil.fromCssPixel(e.style.left), JSUtil.fromCssPixel(e.style.top));
	}

	inline public static function bind(eventType:String, handler:JqEvent->Void)
	{
		new JQuery(DocElements.mainNameHash).bind(eventType, handler);
	}

	inline public static function unbind(eventType:String, handler:JqEvent->Void)
	{
		new JQuery(DocElements.mainNameHash).unbind(eventType, handler);
	}

	inline public static function addEventListener(element:HtmlDom, eventType:String, handler:Event->Void)
	{
		untyped
		{
			if (js.Lib.isIE)
			{
				element.attachEvent(eventType, handler, false);
			}
			else
			{
				element.addEventListener(eventType, handler, false);
			}
		}
	}

	inline public static function removeEventListener(element:HtmlDom, eventType:String, handler:Event->Void)
	{
		untyped
		{
			if (js.Lib.isIE)
			{
				element.detachEvent(eventType, handler, false);
			}
			else
			{
				element.removeEventListener(eventType, handler, false);
			}
		}
	}

	inline public static function applyLayout(element:HtmlDom, x, y, width, height)
	{
		setPosition(element, x, y);
		applyDimentions(element, width, height);
	}

	inline public static function getOffsetLayout(element:HtmlDom)
	{
		return new Layout(element.offsetLeft, element.offsetTop, getWidth(element), getHeight(element));
	}

	inline public static function getMaxWidth(container:HtmlDom, ignoreList:Array<HtmlDom>=null):Int
	{
		var children:HtmlCollection<HtmlDom> = container.childNodes;
		var width = 0;
		for (i in 0...children.length)
		{
			if (ignoreList != null && (Lambda.indexOf(ignoreList, children[i]) > -1))
			{
				continue;
			}
			width = Std.int(Math.max(width, JSUtil.getWidth(children[i])));
		}
		return width;
	}

	inline public static function sumChildrenHeight(container:HtmlDom):Int
	{
		var children:HtmlCollection<HtmlDom> = container.childNodes;
		var width = 0;
		for (i in 0...children.length)
		{
			width = Std.int(Math.max(width, JSUtil.getWidth(children[i])));
		}
		return width;
	}

	inline public static function setPosition(element:HtmlDom, x:Int, y:Int)
	{
		setX(element, x);
		setY(element, y);
	}

	inline public static function setX(element:HtmlDom, x:Int)
	{
		element.style.left = JSUtil.cssPixels(x);
	}

	inline public static function setY(element:HtmlDom, y:Int)
	{
		element.style.top = JSUtil.cssPixels(y);
	}

	inline public static function applyDimentions(element:HtmlDom, width, height)
	{
		element.style.width = JSUtil.cssPixels(width);
		element.style.height = JSUtil.cssPixels(height);
	}

	inline public static function isTouchDevice():Bool
	{
		return untyped __js__('"ontouchstart" in window');
	}

	inline public static function createTextView(id:String, text:String, fontSize:String, x:Int, y:Int, labelStyle='h1'):HtmlDom
	{
		var textView:HtmlDom = Lib.document.createElement(labelStyle);
		var textNode = Lib.document.createTextNode(text);
		textView.appendChild(textNode);
		textView.id = id;
		textView.style.fontSize = fontSize;
		textView.style.left = JSUtil.cssPixels(x);
		textView.style.top = JSUtil.cssPixels(y);
		textView.className = 'label';
		textView.style.position = 'absolute';
		return textView;
	}

	public static inline function createRoundButton(id:String,
													layout:Layout,
													imageAsset:ImageInfo=null)
	{
		var button:HtmlDom = Lib.document.createElement('div');
		button.id = id;
		button.className = 'roundButton';
		button.style.position = 'absolute';
		layout.applyToElement(button);
		if (imageAsset != null)
		{
			var icon = setupImage(imageAsset.createElement());
			var iconX = Std.int(layout.width / 2 - getWidth(icon) / 2);
			var iconY = Std.int(layout.height / 2 - getHeight(icon) / 2);
			button.appendChild(icon);
			setPosition(icon, iconX, iconY);
		}
		setHitArea(button, layout, 0, 0);
		return button;
	}

	public static inline function createButton(caption:String, id:String,
						  layout:Layout,
						  styleClass:String='button',
						  paddingV:Int=0, paddingH:Int=0,
						  fontSize:Int=30,
						  imageAsset:ImageInfo=null):HtmlDom
	{
		var button:HtmlDom = Lib.document.createElement('div');
		button.id = id;
		button.className = styleClass;
		button.style.position = 'absolute';
		layout.applyToElement(button);
		if (paddingV > -1)
		{
			button.style.padding = Std.format("${paddingV}px ${paddingH}px");
		}
		button.style.fontSize = cssPixels(fontSize);

		if (caption != null && caption.length > 0)
		{
			button.appendChild(Lib.document.createTextNode(caption));
		}

		if (imageAsset != null)
		{
			button.appendChild(setupImage(imageAsset.createElement()));
		}

		setHitArea(button, layout, paddingH, paddingV);

		return button;
	}

	static function setHitArea(button:HtmlDom, layout:Layout, paddingH:Int, paddingV:Int)
	{
		var hitArea = Lib.document.createElement('div');
		hitArea.id = button.id + 'Hit';
		hitArea.className = 'buttonHit';
		hitArea.style.position = 'absolute';
		JSUtil.applyLayout(hitArea, 0, 0, layout.width + paddingH * 2, layout.height + paddingV * 2);
		button.appendChild(hitArea);
	}

	public static inline function setupImage(img:HtmlDom):HtmlDom
	{
		img.style.marginTop = 'auto';
		img.style.marginBottom = 'auto';
		img.style.position = 'absolute';
		return img;
	}

	public static inline function getFirstTouchPoint(event:Dynamic):Point
	{
		var touchEvent = event.originalEvent.touches[0];
		return new Point(touchEvent.pageX, touchEvent.pageY);
	}

	public static inline function getFirstReleasedPoint(event:Dynamic):Point
	{
		var touchEvent = event.originalEvent.changedTouches[0];
		return new Point(touchEvent.pageX, touchEvent.pageY);
	}

	public static inline function setOpacity(element:HtmlDom, opacity:Float)
	{
		untyped {element.style.opacity = opacity;};
	}

	public static inline function getOpacity(element:HtmlDom):Float
	{
		var opacity = Std.parseFloat( untyped {element.style.opacity;});
		return opacity;
	}

	public static inline function setBGColor(element:HtmlDom, color:Int)
	{
		element.style.backgroundColor = cssHexColor(color);
	}

	public static inline function setGradient(element:HtmlDom, startColor:Int, endColor:Int, startAlpha:Float=1, endAlpha:Float=1)
	{
		var start = rgbaString(startColor, startAlpha);
		var end = rgbaString(endColor, endAlpha);
		element.style.backgroundImage = Std.format("-moz-linear-gradient(top, $start, $end)");
		element.style.backgroundImage = Std.format("-webkit-linear-gradient(top, $start, $end)");
		element.style.backgroundImage = Std.format("-webkit-gradient(linear, left top, left bottom, color-stop(0, $start), color-stop(1, $end))");
		element.style.backgroundImage = Std.format("-ms-linear-gradient(top, $start, $end)");
		element.style.backgroundImage = Std.format("-o-linear-gradient(top, $start, $end)");
	}

	public static inline function stretchHorizontalBackgroundImage(element:HtmlDom)
	{
		untyped {element.style.backgroundsize = '100%';};
	}

}
