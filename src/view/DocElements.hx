package view;

import js.Dom;
class DocElements
{
	public static inline var mainName:String = "mainContainer";
	public static inline var mainNameHash:String = "#" + mainName;
	public static inline var mainElement:HtmlDom = js.Lib.document.getElementById(mainName);

	public static inline var cloudContainer:HtmlDom = js.Lib.document.getElementById("cloudContainer");
	public static inline var menuContainer:HtmlDom = js.Lib.document.getElementById("menuContainer");

	public static inline var controlsContainer:HtmlDom = js.Lib.document.getElementById("controlsContainer");
	public static inline var controlsNameHash:String = "#controlsContainer";

	public static inline var splashName:String = "splashContainer";
	public static inline var splashNameHash:String = "#" + splashName;
	public static inline var splashElement:HtmlDom = js.Lib.document.getElementById(splashName);
	public static inline var body:Body = js.Lib.document.body;

	public static function getNewElement(type:String,
										 id:String='',
										 className:String='',
										 position='absolute'
										 ):HtmlDom
	{
		var element = js.Lib.document.createElement(type);
		element.id = id;
		element.className = className;
		element.style.position = position;
		return element;
	}
}