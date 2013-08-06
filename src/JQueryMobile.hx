package jQueryMobile;



#if JQUERY_NOCONFLICT
@:native("jQuery.mobile.buttonMarkup")
#else
@:native("$.mobile.buttonMarkup")
#end
extern class ButtonMarkup {
  public static var hoverDelay:String;
}


#if JQUERY_NOCONFLICT
@:native("jQuery.mobile.fixedToolbars")
#else
@:native("$.mobile.fixedToolbars")
#end
extern class FixedToolbars {
  public static function show(?immediately:Bool):Void;
  public static function hide(?immediately:Bool):Void;
}


#if JQUERY_NOCONFLICT
@:native("jQuery.mobile.path")
#else
@:native("$.mobile.path")
#end
extern class Path {
  public static function parseUrl(url:String):Dynamic;
  public static function makePathAbsolute(relPath:String, absPath:String):String;
  public static function makeUrlAbsolute(relUrl:String, absUrl:String):String;
  public static function isSameDomain(url1:String, url2:String):Bool;
  public static function isRelativeUrl(url:String):Bool;
  public static function isAbsoluteUrl(url:String):Bool;
  public static function get(url:String):String;
  
  
}


#if JQUERY_NOCONFLICT
@:native("jQuery.mobile")
#else
@:native("$.mobile")
#end

extern class JQueryMobile {
  public static var activeBtnClass:String;
  public static var activePageClass:String;
  public static var ajaxEnabled:String;
  public static var allowCrossDomainPages:String;
  public static var autoInitializePage:String;
  public static var buttonMarkup_hoverDelay:String;  // this needs work
  public static var defaultDialogTransition:String;
  public static var defaultPageTransition:String;
  public static var hashListeningEnabled:Bool;
  public static var ignoreContentEnabled:Bool;
  public static var linkBindingEnabled:Bool;
  public static var loadingMessage:String;
  public static var loadingMessageTextVisible:String;
  public static var loadingMessageTheme:String;
  public static var minScrollBack:Int;
  public static var ns:String;
  public static var pageLoadErrorMessage:String;
  public static var pageLoadErrorMessageTheme:String;
  public static var pushStateEnabled:Bool;
  public static var subPageUrlKey:String;
  public static var touchOverflowEnabled:Bool;
  public static var activePage:String;
  

  public static function gradeA():Bool;
  public static function changePage(to:String, ?options:Dynamic):Void;
  public static function loadPage(url:String, ?options:Dynamic):Void;  
  public static function showPageLoadingMsg(?theme:String, ?msgText:String, ?textOnly:Bool):Void;

  public static function fixedToolbars():FixedToolbars {
    return FixedToolbars;
  }

  public static function path():FixedToolbars {
    return Path;
  }

  //  public static function base() // no docs, no implement!

  public static function silentScroll(yPos:Int):Void;
  
}
