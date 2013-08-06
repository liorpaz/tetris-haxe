package util;

import view.DocElements;
import util.JSUtil;
import haxe.Timer;
import js.Dom;
import js.Lib;

class DebugConsole
{
	static var instance:DebugConsole;
	static inline var DISPLAY_TIME:Int = 10000;

	public static var enabled:Bool = false;

	var console:HtmlDom;
	var logCount:Int = 0;

	var timer:Timer;

	function new()
	{
    }

	public static function getInstance():DebugConsole
	{
		if (instance == null)
		{
			instance = new DebugConsole();
		}
		return instance;
	}

	public function log(str:String, clearConsole:Bool=true)
	{
//		if (!enabled)
//		{
//			return;
//		}
		createConsole();
		if (clearConsole || logCount > 4)
		{
			clear();
			logCount = 0;
		}
		logCount++;
		console.innerHTML += str + "<br>";

		if (timer != null)
		{
			timer.stop();
		}
		timer = new Timer(DISPLAY_TIME);
		timer.run = removeLog;
	}

	function removeLog()
	{
		timer.stop();
		timer = null;
		DocElements.body.removeChild(console);
	}

	public function clear()
	{
		console.innerHTML = '';
	}

	function createConsole()
	{
		if (console == null)
		{
			console = Lib.document.createElement('div');
			if (enabled)
			{
				console.className = 'debugConsole';
			}
			else
			{
				console.className = 'debugConsole';
				JSUtil.applyDimentions(console, 50, 50);
				JSUtil.setOpacity(console, 0.1);
				console.style.overflow = "hidden";
				console.style.visibility = "hidden";
			}
		}
		if (console.parentNode == null)
		{
			DocElements.body.appendChild(console);
		}
	}
}
