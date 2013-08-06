package view;
import util.JSUtil;
import js.Lib;
import js.Dom;

class Assets
{
	public static inline var cloudsBottom:ImageInfo = new ImageInfo('resources/images_mdpi/clouds_bottom.png', 0, 0, 320, 55);
	public static inline var cloudsButtonsBackground:ImageInfo = new ImageInfo('resources/images_mdpi/clouds_btns_background.png', 0, 0, 320, 39);
	public static inline var cloudsButtons:ImageInfo = new ImageInfo('resources/images_mdpi/clouds_btns.png', 0, 0, 320, 60);
	public static inline var cloudsLeft:ImageInfo = new ImageInfo('resources/images_mdpi/clouds_left.png', 0, 0, 27, 101);
	public static inline var cloudsRight:ImageInfo = new ImageInfo('resources/images_mdpi/clouds_right.png', 0, 0, 40, 79);
	public static inline var cloudsTop:ImageInfo = new ImageInfo('resources/images_mdpi/clouds_top.png', 0, 0, 159, 20);
	public static inline var facebookLogo:ImageInfo = new ImageInfo('resources/images_mdpi/facebook.png', 0, 0, 44, 44);
	public static inline var instructions1:ImageInfo = new ImageInfo('resources/images_mdpi/tip_1_content.png', 0, 0, 161, 200);
	public static inline var instructions2:ImageInfo = new ImageInfo('resources/images_mdpi/tip_2_content.png', 0, 0, 136, 200);
	public static inline var instructions3:ImageInfo = new ImageInfo('resources/images_mdpi/tip_3_content.png', 0, 0, 201, 200);

	public static inline var closeButton:ImageInfo = new ImageInfo('resources/images_mdpi/close_btn.png', 0, 0, 18, 18);
	public static inline var doneButton:ImageInfo = new ImageInfo('resources/images_mdpi/done_btn.png', 0, 0, 18, 18);
	public static inline var nextButton:ImageInfo = new ImageInfo('resources/images_mdpi/next_btn.png', 0, 0, 18, 18);

	public static inline var pauseButton:ImageInfo = new ImageInfo('resources/images_mdpi/pause_btn.png', 0, 0, 13, 18);
	public static inline var separator:ImageInfo = new ImageInfo('resources/images_mdpi/bottom_border.png', 0, 0, 239, 1);
	public static inline var separatorWithDots:ImageInfo = new ImageInfo('resources/images_mdpi/top_border.png', 0, 0, 239, 5);
	public static inline var skyBgTile:ImageInfo = new ImageInfo('resources/images_mdpi/sky_bg_tile.png', 0, 0, 100, 100);
	public static inline var skyTumblerLogo:ImageInfo = new ImageInfo('resources/images_mdpi/sky_tumble_logo.png', 0, 0, 162, 92);
	public static inline var tip1Content:ImageInfo = new ImageInfo('resources/images_mdpi/tip_1_content.png', 0, 0, 225, 280);
	public static inline var tip1:ImageInfo = new ImageInfo('resources/images_mdpi/tip_1.png', 0, 0, 277, 355);
	public static inline var tweeterLogo:ImageInfo = new ImageInfo('resources/images_mdpi/tweeter.png', 0, 0, 44, 44);

	public static inline var emptyCircle:ImageInfo = new ImageInfo('resources/images_mdpi/empty_circle.png', 0, 0, 10, 10);
	public static inline var fullCircle:ImageInfo = new ImageInfo('resources/images_mdpi/full_circle.png', 0, 0, 10, 10);

	static var preloadedImages:Array<HtmlDom>;
	public static function preload(images:Array<ImageInfo>)
	{
		if (preloadedImages == null)
		{
			preloadedImages = [];
		}

		for (image in images)
		{
			var imageElement = Lib.document.createElement('img');
			imageElement.setAttribute('src', image.url);
			preloadedImages.push(imageElement);
		}
	}
}


class ImageInfo
{
	public var url:String;
	public var id:String;
	public var x:Int;
	public var y:Int;
	public var width:Int;
	public var height:Int;

	public function new(url:String, x:Int, y:Int, width:Int, height:Int)
	{
		this.url = url;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		var regex = ~/\/|\\/g;
		id = regex.replace(url, '');
		id = Std.format("${id}_${x}_${y}_${width}_${height}");
	}

	public function createElement():HtmlDom
	{
		var imageElement = Lib.document.createElement('img');
		imageElement.setAttribute('src', url);
		imageElement.style.width = JSUtil.cssPixels(width);
		imageElement.style.height = JSUtil.cssPixels(height);
		imageElement.id = id;
		imageElement.style.position = 'absolute';
		return imageElement;
	}
}
