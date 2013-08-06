package controller;

import util.JSUtil;
import util.JSUtil;
import util.Point;
import util.AnimationUtil;
import controller.OpponentStateMeter;
import util.JSUtil;
import util.JSUtil;
import view.ScreenLayouter;
import view.DocElements;
import js.Dom;

class OpponentStateMeter
{
	inline static var ELEMENT_NAME = 'opponentMeter';
	inline static var INDICATOR_MOVE_TIME:Int = 500;
	inline static var STRIPE_THICKNESS:Int = 1;
	inline static var DANGER_COLOR:Int = 0xFF0000;

	var container:HtmlDom;
	var stripesContainer:HtmlDom;
	var players:Array<PlayerInfo>;
	var indicatorX:Int = 0;
	var indicatorSize:Int;
	var height:Int;
	var blockHeight:Int;
	var layout:Layout;

    public function new(layout:Layout, blockHeight:Int)
	{
		container = DocElements.getNewElement('div', ELEMENT_NAME, ELEMENT_NAME);
		this.layout = layout;
		layout.applyToElement(container);
		drawSegmentsOnBackground(blockHeight);
		indicatorSize = layout.width;
		height = layout.height;
		this.blockHeight = blockHeight;
		DocElements.mainElement.appendChild(container);

		players = [];
    }

	function drawSegmentsOnBackground(segmentHeight:Int)
	{
		stripesContainer = DocElements.getNewElement('div', 'stripeContainer', 'stripeContainer');
		JSUtil.applyLayout(stripesContainer, 0, 0, layout.width, layout.height);

		var numStripes = Std.int(layout.height / segmentHeight);
		var stripe;
		for (i in 0...numStripes)
		{
			stripe = DocElements.getNewElement('div', 'stripe', 'stripe');
			JSUtil.applyLayout(stripe, 0, i * segmentHeight, layout.width, STRIPE_THICKNESS);
			stripesContainer.appendChild(stripe);
		}
		container.appendChild(stripesContainer);

	}

	public function addPlayer(name:String, color:Int)
	{
		var player = new PlayerInfo(name, color, 0, new PlayerIndicator(color, indicatorSize, indicatorSize));
		players.push(player);
		container.insertBefore(player.indicator.getView(), stripesContainer);
		updatePlayer(players.length - 1);
	}

	public function setPlayerInDangerZone(index:Int)
	{
		JSUtil.setBGColor(players[index].indicator.getView(), DANGER_COLOR);
	}

	public function setPlayerOutOfDangerZone(index:Int)
	{
		var player = players[index];
		JSUtil.setBGColor(player.indicator.getView(), player.color);
	}

	function getPlayerByName(name):PlayerInfo
	{
		for (player in players)
		{
			if (player.name == name)
			{
				return player;
			}
		}
		return null;
	}

	public function setPlayerHeight(player:Int, height:Float)
	{
		if (players.length > player)
		{
			players[player].height = height;
			updatePlayer(player);
		}
	}

	public function resetPositions()
	{
		for (i in 0...players.length)
		{
			setPlayerHeight(i, 0);
		}
	}

	function updatePlayer(player:Int)
	{
		var y:Int = Std.int(height * (1 - players[player].height));
		var playerView = players[player].indicator.getView();
		var topLeft = new Point(indicatorX, Std.int(y));
		var newHeight = Std.int(height - topLeft.y);
		AnimationUtil.changeSize(playerView, INDICATOR_MOVE_TIME, indicatorSize, newHeight);
		AnimationUtil.move(playerView, INDICATOR_MOVE_TIME, topLeft);
	}
}

class PlayerInfo
{
	public var name:String;
	public var color:Int;
	public var height:Float;
	public var indicator:PlayerIndicator;

	public function new(name:String, color:Int, height:Int, indicator:PlayerIndicator)
	{
		this.name = name;
		this.color = color;
		this.height = height;
		this.indicator = indicator;
	}
}

class PlayerIndicator
{
	var container:HtmlDom;

	public function new(color:Int, width:Int, height:Int)
	{
		container = DocElements.getNewElement('div', 'playerIndicator'+color, 'playerIndicator');
		JSUtil.applyDimentions(container, width, height);
		JSUtil.setBGColor(container, color);
	}
	public function getView():HtmlDom
	{
		return container;
	}
}