/*:
 * @plugindesc wolfzq追加功能。
 * @author wolfzq  
 * @target MZ
 * @help 
 * wolfzq追加功能。
 */

/*增加全局参数*/
var $we = null;

// Wolfzq_Event
function Wolfzq_Event() {
	this.initialize.apply(this, arguments);
};

Wolfzq_Event.prototype.initialize = function () {
	//this.steam = true; //steam版本去掉双斜杠
	this.steam = false; //非steam版本去掉双斜杠
};

ConfigManager._recalls = {};
Wolfzq_Event.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function () {
	const config = Wolfzq_Event.ConfigManager_makeData.call(this);
	config._recalls = this._recalls;
	return config;
};
Wolfzq_Event.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function (config) {
	Wolfzq_Event.ConfigManager_applyData.call(this, config)
	this._recalls = config._recalls ? config._recalls : {};
};
DataManager.SaveAllRecalls = function (len) {
	len = len || 220;
	for (var i = 0; i < len; i++) {
		ConfigManager._recalls[i] = true;
	}
	ConfigManager.save();
}

DataManager.SaveRecall = function (id) {
	ConfigManager._recalls[id] = true;
	ConfigManager.save();
}

var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function () {
	_Game_CharacterBase_initMembers.call(this);
	this._tmpX = 0;	//X轴偏移
	this._tmpY = 0;	//Y轴偏移
}

//-----------------局部位移----------------------
var _Game_Player_locate = Game_Player.prototype.locate;
Game_Player.prototype.locate = function (x, y) {
	this._tmpX = 0;
	this._tmpY = 0;
	_Game_Player_locate.call(this, x, y);
}

Game_CharacterBase.prototype.rotation = function () {
	return this._rotation;
};
Game_CharacterBase.prototype.setTempX = function (x) {
	this._tmpX += x;
	this._x += x;
};
Game_CharacterBase.prototype.setTempY = function (y) {
	this._tmpY += y;
	this._y += y;
};
Game_CharacterBase.prototype.setTemp = function (x, y) {
	this.setTempX(x);
	this.setTempY(y);
};
Game_CharacterBase.prototype.setFrontTemp = function (x) {
	var de = this.direction();
	switch (de) {
		case 2:
			this.setTempY(x);
			break;
		case 4:
			this.setTempX(-x);
			break;
		case 6:
			this.setTempX(x);
			break;
		case 8:
			this.setTempY(-x);
			break;
	}
};
Game_CharacterBase.prototype.clearTemp = function () {
	this._x = Math.round(this._x - this._tmpX);
	this._y = Math.round(this._y - this._tmpY);
	this._tmpX = 0;
	this._tmpY = 0;
};
//-----------------局部位移结束---------------

//-----------------战斗加速-------------------
Scene_Battle.prototype.isFastForward = function () {
	return (Input.isLongPressed('ok') || TouchInput.isLongPressed());
};

var _Wolfzq_Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
	if (this.isFastForward()) {
		//2倍数
		_Wolfzq_Scene_Battle_update.call(this);
	}
	if (Input.isLongPressed('skip')) {
		//6倍速
		for (var i = 0; i < 5; i++) {
			_Wolfzq_Scene_Battle_update.call(this);
		}
	}
	_Wolfzq_Scene_Battle_update.call(this);
};
//-----------------战斗加速结束---------------

//-----------------场景加速-------------------
Scene_Map.prototype.isSkipForward = function () {
	return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() && Input.isLongPressed('skip'));
};

var _Wolfzq_Scene_Map_updateMainMultiply = Scene_Map.prototype.updateMainMultiply;
Scene_Map.prototype.updateMainMultiply = function () {
	if (this.isSkipForward()) {
		for (var i = 0; i < 9; i++) {
			_Wolfzq_Scene_Map_updateMainMultiply.call(this);
		}
	}
	_Wolfzq_Scene_Map_updateMainMultiply.call(this);
};
//-----------------场景加速结束---------------
//-----------------非战斗加速-----------------


Sprite_AnimationMV.prototype.isSkipForward = function () {
	return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() && Input.isLongPressed('skip'));
};

var _Wolfzq_Sprite_AnimationMV_update = Sprite_AnimationMV.prototype.update;
Sprite_AnimationMV.prototype.update = function () {
	if (this.isSkipForward()) {
		for (var i = 0; i < 9; i++) {
			_Wolfzq_Sprite_AnimationMV_update.call(this);
		}
	}
	_Wolfzq_Sprite_AnimationMV_update.call(this);
};

var _Wolfzq_Sprite_Animation_update = Sprite_Animation.prototype.update;
Sprite_Animation.prototype.update = function () {
	_Wolfzq_Sprite_Animation_update.call(this);
	if (this._handle) {
		if (Input.isLongPressed('skip'))
			this._handle.setSpeed(this._animation.speed / 10);
		else if (Input.isLongPressed('ok') || TouchInput.isLongPressed())
			this._handle.setSpeed(this._animation.speed / 50);
	}
};

Sprite_Balloon.prototype.isFastForward = function () {
	if (!BattleManager._phase) {
		return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() && (Input.isLongPressed('ok') || TouchInput.isLongPressed()));
	}
};
Sprite_Balloon.prototype.isSkipForward = function () {
	if (!BattleManager._phase) {
		return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() && Input.isLongPressed('skip'));
	}
};

var _Wolfzq_Sprite_Balloon_update = Sprite_Balloon.prototype.update;
Sprite_Balloon.prototype.update = function () {
	if (this.isSkipForward()) {
		for (var i = 0; i < 9; i++) {
			_Wolfzq_Sprite_Balloon_update.call(this);
		}
	} else if (this.isFastForward()) {
		_Wolfzq_Sprite_Balloon_update.call(this);
	}
	_Wolfzq_Sprite_Balloon_update.call(this);
};
//-----------------非战斗加速结束-------------

//-----------------对话框加速-----------------
Window_Message.prototype.isSkip = function () {
	return (Input.isRepeated('skip') || TouchInput.isRepeated());
};

var _Wolfzq_Window_Message_startPause = Window_Message.prototype.startPause;
Window_Message.prototype.startPause = function () {
	if (this.isSkip()) {
		this.startWait(0);
		this.pause = true;
	} else {
		_Wolfzq_Window_Message_startPause.call(this);
	}
}
//-----------------对话框加速结束-------------
Window_Message.prototype.isTriggered = function () {
	return (
		Input.isRepeated("ok") || Input.isRepeated("cancel") ||
		Input.isRepeated('skip') || TouchInput.isRepeated()
	);
};

//-----------------------------------------------------------------------------
//-----------------随机点阵停止移动-------------
var _Wolfzq_Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
Game_Event.prototype.updateSelfMovement = function () {
	if ($gameSwitches.value(17)) {
		return;
	}
	_Wolfzq_Game_Event_updateSelfMovement.call(this);
};
//-----------------随机点阵停止移动结束-------------

//按照难度设定，给敌人追加对应状态。
var _Wolfzq_Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function (enemyId, x, y) {
	_Wolfzq_Game_Enemy_setup.call(this, enemyId, x, y);
	var diff = $gameVariables.value(420);
	if (diff < -2) { diff = -2; } else if (diff > 1) { diff = 1; }
	this.addState(98 + diff);
};

var _Wolfzq_BattleManager_initMembers = BattleManager.initMembers;
BattleManager.initMembers = function () {
	$we.refreshCloths();
	_Wolfzq_BattleManager_initMembers.call(this);
}

Game_Player.prototype.getOnVehicle = function () {
	const direction = this.direction();
	const x1 = this.x;
	const y1 = this.y;
	const x2 = $gameMap.roundXWithDirection(x1, direction);
	const y2 = $gameMap.roundYWithDirection(y1, direction);
	if ($gameMap.airship().pos(x1, y1)) {
		this._vehicleType = "airship";
	} else if ($gameMap.ship().pos(x2, y2)) {
		this._vehicleType = "ship";
	} else if ($gameMap.boat().pos(x2, y2)) {
		this._vehicleType = "boat";
	} else if ($gameSwitches.value(19) && $gameMap.mapId() == $gameMap._vehicles[2]._mapId) {
		//wolfzq飞行器
		this._vehicleType = "airship";
		var ve = this.vehicle();
		ve.setPosition(x1, y1);
		ve.setDirection(this.direction());
		this.inShip();
	}
	if (this.isInVehicle()) {
		this._vehicleGettingOn = true;
		if (!this.isInAirship()) {
			this.forceMoveForward();
		}
		this.gatherFollowers();
	}
	return this._vehicleGettingOn;
};

Scene_Map.prototype.createSpriteset = function () {
	this._spriteset = new Spriteset_Map();
	$gamePlayer.inShip();
	this.addChild(this._spriteset);
	this._spriteset.update();
};

// 场景切换时自动清理精灵（防止残留）
var _wolfzq_Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function () {
	_wolfzq_Scene_Map_terminate.call(this);
	$gamePlayer.outShip(); // 场景销毁时强制销毁精灵
};

Game_Player.prototype.inShip = function () {
	if (this._vehicleType == "airship") {
		//分层点图设定
		if (!$gameMap._flyActor) {
			var ve = $gameMap._vehicles[2];
			ve.setImage("$newCharacterMain", 0); //设置精灵身体
			$gameMap._flyActor = new Sprite_Character_Base(ve);
			SceneManager._scene._spriteset.addChild($gameMap._flyActor);
			//增加更高层级的精灵，播放莲花动态
			var actor = $gameParty.allMembers()[0];
			actor._equipForLayer[4] = "$x1";
		}
		//单张点图设定
		//this.vehicle().setImage("$YHFX", 0);
	}
};

Game_Player.prototype.outShip = function () {
	if ($gameMap._flyActor) {
		$gameMap._flyActor.parent.removeChild($gameMap._flyActor);
	}
	$gameMap._flyActor = undefined;
};

Game_Player.prototype.getOffVehicle = function () {
	if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
		this._followers.synchronize(this.x, this.y, this.direction());
		this.vehicle().getOff();
		if (!this.isInAirship()) {
			this.forceMoveForward();
			this.setTransparent(false);
		}
		this._vehicleGettingOff = true;
		this.setMoveSpeed(4);
		this.setThrough(false);
		this.makeEncounterCount();
		this.gatherFollowers();
	}
	return this._vehicleGettingOff;
};

Game_Vehicle.prototype.getOff = function () {
	this._driving = false;
	this.setWalkAnime(false);
	this.setStepAnime(false);
	if (!$gameSwitches.value(19)) {
		this.resetDirection();
	}
	$gameSystem.replayWalkingBgm();
};

Game_Player.prototype.updateVehicle = function () {
	if (this.isInVehicle() && !this.areFollowersGathering()) {
		if (this._vehicleGettingOn) {
			this.updateVehicleGetOn();
		} else if (this._vehicleGettingOff) {
			this.updateVehicleGetOff();
		} else {
			this.vehicle().syncWithPlayer();
		}
	}
};

Game_Player.prototype.updateVehicleGetOn = function () {
	if (!this.areFollowersGathering() && !this.isMoving()) {
		this.setDirection(this.vehicle().direction());
		this.setMoveSpeed(this.vehicle().moveSpeed());
		this._vehicleGettingOn = false;
		this.setTransparent(true);
		if (this.isInAirship()) {
			this.setThrough(true);
		}
		this.vehicle().getOn();
	}
};

Game_Player.prototype.updateVehicleGetOff = function () {
	if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
		this._vehicleGettingOff = false;
		this._vehicleType = "walk";
		this.setTransparent(false);
		if ($gameSwitches.value(19)) {
			//wolfzq飞行着陆隐藏飞行器
			$gameSwitches.setValue(19, false);
			var ve = $gameMap._vehicles[2];
			ve.setImage("", 0);
			ve.setPosition(1, 1);
			var actor = $gameParty.allMembers()[0];
			actor._equipForLayer[4] = "";
			this.outShip();
		}
	}
};

Game_Player.prototype.moveByInput = function () {
	if (!this.isMoving() && this.canMove()) {
		let direction = this.getInputDirection();
		if (direction > 0) {
			$gameTemp.clearDestination();
		} else if ($gameTemp.isDestinationValid()) {
			const x = $gameTemp.destinationX();
			const y = $gameTemp.destinationY();
			direction = this.findDirectionTo(x, y);
		}
		if (direction > 0) {
			this.executeMove(direction);
		} else {
			if ($gameSystem._flyNpc) {
				//wolfzq追加飞行点击事件后自动落地，并执行事件功能。
				if (this.x == $gameSystem._flyNpc[0] && this.y == $gameSystem._flyNpc[1]) {
					if ($gameSwitches.value(19)) {
						$we.stopFly();
					} else {
						$gameMap.eventsXy(this.x, this.y).forEach(function (ev) {
							const event = $gameMap.events()[ev._eventId];
							if ($we.checkEventContent(event)) {
								ev.start();
							}
						});
						$gameSystem._flyNpc = undefined;
					}
				}
			}
		}
	}
};

Game_Vehicle.prototype.isLandOk = function (x, y, d) {
	if (this.isAirship()) {
		if (!$gameMap.isAirshipLandOk(x, y)) {
			return false;
		}
		/*if ($gameMap.eventsXy(x, y).length > 0) {
			return false;
		}*/
	} else {
		var x2 = $gameMap.roundXWithDirection(x, d);
		var y2 = $gameMap.roundYWithDirection(y, d);
		if (!$gameMap.isValid(x2, y2)) {
			return false;
		}
		if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
			return false;
		}
		if (this.isCollidedWithCharacters(x2, y2)) {
			return false;
		}
	}
	return true;
};

//改变一个事件的自动开关
Wolfzq_Event.prototype.changeSwitch = function (id, key, value) {
	var selfKey = [$gameMap.mapId(), id, key];
	$gameSelfSwitches.setValue(selfKey, value);
};
Wolfzq_Event.prototype.changeSwitchs = function (ids, key, value) {
	var len = ids.length;
	var mapId = $gameMap.mapId();
	for (var i = 0; i < len; i++) {
		var selfKey = [mapId, ids[i], key];
		$gameSelfSwitches.setValue(selfKey, value);
	}
};
Wolfzq_Event.prototype.getSwitch = function (id, key) {
	var selfKey = [$gameMap.mapId(), id, key];
	return $gameSelfSwitches.value(selfKey);
};
Wolfzq_Event.prototype.getEvent = function (eventId) {
	if (eventId > 0) {
		return $gameMap.event(eventId);
	} else {
		return $gamePlayer;
	}
};
Wolfzq_Event.prototype.locateEvent = function (eventId, x, y) {
	var event = this.getEvent(eventId);
	if (!event._erased) {
		event.locate(x, y);
	}
};
Wolfzq_Event.prototype.saveActiveEvents = function () {
	//获取地图上可以用的事件
	this.saveEvents = {};
	for (const character of $gameMap.events()) {
		if (!character) continue;
		if ($we.checkEventContent(character)) {
			$we.saveEvents[character._eventId] = true;
		}
	}
};
Wolfzq_Event.prototype.checkEventContent = function (character) {
	const event = character.event();
	if (!event) return false;
	for (const page of event.pages) {
		if (character.meetsConditions(page) && page.list && page.list.length > 0) {
			// 排除仅注释的情况
			const hasRealCmd = page.list.some(cmd => cmd.code !== 108 && cmd.code !== 408);
			return hasRealCmd;
		}
	}
	return false;
};

Wolfzq_Event.prototype.refreshCloths = function () {
	//获取全部服饰，重新加载
	const actor = $gameParty.allMembers()[0];
	this.defaultCloth(actor);
	const ccls = Cat.CharacterLayer.layerBack.concat(Cat.CharacterLayer.layerFor);
	for (var i = 0; i < ccls.length; i++) {
		var type = ccls[i];
		var id = actor.allCloths[type];
		if (id) {
			this.changeCloth($dataItems[id], type);
		} else {
			this.noCloth(type);
		}
	}
};


Wolfzq_Event.prototype.defaultCloth = function (actor, type) {
	if (!actor.allCloths) {
		actor.allCloths = { '衣服': 788, '头发': 814 };
	}
	if (type) {
		var pitem = $gameSwitches.value(Cat.PictureLayer.rmSwitch) ? 933 : 788;
		this.changeCloth($dataItems[pitem], type, true);
		var vsm = SceneManager._scene;
		if (vsm._mapMainBaseSprite) {
			vsm.removeChild(vsm._mapMainBaseSprite)
			vsm.createPictureLayer();
		}
	}
};

Wolfzq_Event.prototype.noCloth = function (type, save) {
	const actor = $gameParty.allMembers()[0];
	if (save) {
		this.defaultCloth(actor);
		actor.allCloths[type] = null;
	}
	const backIndex = Cat.CharacterLayer.layerBack.indexOf(type);
	const forIndex = Cat.CharacterLayer.layerFor.indexOf(type);
	const pictureForIndex = Cat.PictureLayer.layerFor.indexOf(type);
	const pictureBackIndex = Cat.PictureLayer.layerBack.indexOf(type);
	if (pictureBackIndex >= 0) {
		actor._equipBackPictureLayer[pictureBackIndex + 1] = '';
	}
	if (pictureForIndex >= 0) {
		actor._equipForPictureLayer[pictureForIndex + 1] = '';
	}
	if (backIndex >= 0) {
		actor._equipBackLayer[backIndex + 1] = '';
	}
	if (forIndex >= 0) {
		actor._equipForLayer[forIndex + 1] = '';
	}
	if (type == '后发' || type == '头发') {
		var pitem = $gameSwitches.value(Cat.PictureLayer.rmSwitch) ? 824 : 815;
		this.changeCloth($dataItems[pitem], type, true);
	}
	if (type == '衣服') {
		$gameTemp._selectTempEquipId = 0;
		actor._equipLayer[3] = null;
		actor._equipLayer[5] = null;
		actor._equipLayer[7] = null;
		actor._equipLayer[9] = null;
		//if ($gameSwitches.value(9)) { //裸体标志不知道还用不用的上
		$gameSwitches.setValue(29, true);
		//}
		// actor._equipLayer = undefined;
	}
};

Wolfzq_Event.prototype.isCloth = function (items, type) {
	var actor = $gameActors.actor(1);
	if (actor.allCloths) {
		var vcs = actor.allCloths;
		if (Array.isArray(items)) {
			if (items.contains(actor.allCloths[type]))
				return true;
		} else {
			if (actor.allCloths[type] == items)
				return true;
		}
	} else {
		if (def) {
			this.defaultCloth(actor);
		}
	}
	return false;
};

Wolfzq_Event.prototype.changeCloth = function (item, type, save) {
	const actor = $gameParty.allMembers()[0];
	if (save) {
		this.defaultCloth(actor);
		if (item && item.id) {
			actor.allCloths[type] = item.id;
		}
	}
	actor.equipForLayerStart();
	actor.equipBackLayerStart();
	/*  if (Cat.CharacterLayer.layerBack.indexOf(type) == -1) {
	
		} else {
	
		}*/
	if (type == '后发') {
		actor._equipLayer[1] = null;
		actor.getItemNote(item, true)//战斗立绘对接
	}
	if (type == '头发') {
		actor._equipLayer[1] = null;
		actor.getItemNote(item, true)//战斗立绘对接
	}
	if (type == '衣服') {
		actor._equipLayer[3] = null;
		actor._equipLayer[5] = null;
		actor._equipLayer[7] = null;
		actor._equipLayer[9] = null;
		actor.getItemNote(item, true)//战斗立绘对接
		$gameTemp._selectTempEquipId = item.id;
	}
	if (item.note.match(/<时装序列>\n([\s\S]+?)\n<\/时装序列>/i)) {
		var data = RegExp.$1.split(/\n/);
		data.forEach(line => {
			if (line.match(/^前[ ](.*)$/i)) {
				const meta = RegExp.$1.split(' ');
				const id = Number(meta[0]);
				const name = String(meta[1]);
				actor._equipLastForLayer[id] = name;
				actor._equipForLayer[id] = name;
			} else if (line.match(/^背[ ](.*)$/i)) {
				//后发特殊处理
				const meta = RegExp.$1.split(' ');
				const id = Number(meta[0]);
				const name = String(meta[1]);
				actor._equipLastBackLayer[id] = name;
				actor._equipBackLayer[id] = name;
			} else if (line.match(/^立绘背[ ](.*)$/i)) {
				const meta = RegExp.$1.split(' ');
				const id = Number(meta[0]);
				const name = String(meta[1]);
				actor._equipBackPictureLayer[id] = name;
			} else if (line.match(/^立绘前[ ](.*)$/i)) {
				const meta = RegExp.$1.split(' ');
				const id = Number(meta[0]);
				const name = String(meta[1]);
				actor._equipForPictureLayer[id] = name;
			};
		})
	};
};

//全部按照某个事件变换
Wolfzq_Event.prototype.copyEvent = function (eventId, events, needPic) {
	if (!events)
		return;
	var event = this.getEvent(eventId);
	var characterName = event._characterName;
	var characterIndex = event._characterIndex;
	var length = events.length;
	for (var i = 0; i < length; i++) {
		var ev = this.getEvent(events[i]);
		if (!ev._erased) {
			if (needPic && ev._characterName == '') {
				continue;
			}
			ev.setImage(characterName, characterIndex);
			ev._direction = event._direction;
			ev._directionFix = event._directionFix;
			ev._moveSpeed = event._moveSpeed;
			ev._moveFrequency = event._moveFrequency;
			ev._opacity = event._opacity;
			ev._blendMode = event._blendMode;
			ev._walkAnime = event._walkAnime;
			ev._stepAnime = event._stepAnime;
			ev._through = event._through;
			ev._transparent = event._transparent;
			ev._bushDepth = event._bushDepth;
			//ev._priorityType = event._priorityType; //0低于玩家，1跟玩家相同，2高于玩家
		}
	}
};

//哪有人会在每个地方写通用破损参数的！如此随意写出的程序代码，当然会被自己的随意反噬！各种问题堆叠后就是怎么修都修不好！
Wolfzq_Event.prototype.breakClothLv = function (hzItem) {
	if (!hzItem)
		return '';
	const value = $gameParty.gainItemDurability(hzItem);
	if (value < 30) {
		return '1';
	} else if (value < 70) {
		return '2';
	} else if (value < 100) {
		return '3';
	}
	return '';
};
//映射，因为原程序不懂映射，这里补做一个，避免被骚操作反噬
Wolfzq_Event.prototype.breakClothLv2 = function (hzItem) {
	var value = this.breakClothLv(hzItem);
	if (value == '1') {
		return '';
	} else if (value == '2') {
		return '_1';
	} else if (value == '3') {
		return '_2';
	}
	return '_3';
};

//飞行脚本
Wolfzq_Event.prototype.stopFly = function () {
	if ($gameMap.mapId() == 144 && $gamePlayer.isInAirship()) {
		$gamePlayer.getOffVehicle();
	} else {
		//关闭变量，解除飞行。
		$gameSwitches.setValue(19, false);
	}
};

//Game over回溯
Wolfzq_Event.prototype.saveEnd = function (obj) {
	//记录玩家位置
	if (obj) {
		$we.recallEventId = obj.eventId();
	} else {
		$we.recallEventId = undefined;
	}
	$we.recallMap = $gameMap.mapId();
	$we.recallX = $gamePlayer._x;
	$we.recallY = $gamePlayer._y;
	$we.recallDirection = $gamePlayer._direction;

	var contents = {};
	contents.actors = $gameActors;
	contents.party = $gameParty;
	contents.player = $gamePlayer;
	contents.switches = $gameSwitches;
	contents.variables = $gameVariables;
	contents.selfSwitches = $gameSelfSwitches;
	this.gameEnd = JsonEx.stringify(contents);
};

Wolfzq_Event.prototype.loadEnd = function () {
	if (!this.gameEnd)
		return;
	var contents = JsonEx.parse(this.gameEnd);
	$gameSwitches = contents.switches;
	$gameVariables = contents.variables;
	$gameActors = contents.actors;
	$gamePlayer = contents.player;
	$gameParty = contents.party;
	$gameSelfSwitches = contents.selfSwitches;
	this.gameEnd = undefined;
};

Wolfzq_Event.prototype.loadEndMap = function (obj) {
	$gamePlayer._needsMapReload = true;
	$gamePlayer.reserveTransfer($we.recallMap, $we.recallX, $we.recallY, $we.recallDirection, 0);
	obj.setWaitMode('transfer');
};

Wolfzq_Event.prototype.loadEndEvent = function () {
	//再次执行剧情
	var evid = $we.recallEventId;
	if (evid && evid > 0) {
		$we.getEvent(evid).start();
	}
};
Wolfzq_Event.prototype.mustUnEquipAllClothes = function () {
	var actor = $gameActors.actor(1);
	var equips = actor.equips();
	var len = equips.length;
	var solt = actor.equipSlots();
	for (var i = 0; i < len; i++) {
		if (equips[i] && equips[i].id != 0) {
			actor.changeEquip(i, null);
		}
	}
};

DataManager.createRoundObjects = function () {
	$gameMessage = new Game_Message();
	$gameSwitches = new Game_Switches();
	$gameVariables = new Game_Variables();
	$gameSelfSwitches = new Game_SelfSwitches();
};
DataManager.saveEndContents = function () {
	var contents = {};
	//$we.mustUnEquipAllClothes();
	//contents.actors	   = $gameActors;
	//contents.party		= $gameParty;
	//contents.player	   = $gamePlayer;
	//contents.system    = $gameSystem;
	contents.switches = $gameSwitches;
	contents.variables = $gameVariables;
	contents.selfSwitches = $gameSelfSwitches;
	$we.gameEnd = JsonEx.stringify(contents);
};
DataManager.loadEndContents = function () {
	var contents = JsonEx.parse($we.gameEnd);
	/*$gameSystem._armorDurability = contents.party._armorDurability;
	$gameActors = contents.actors;
	$gameParty = contents.party;
	$gamePlayer = contents.player;
	$gameSystem = contents.system;*/
	//初始化插件影响的system
	$gameSystem.initialize();
	//保留部分变量
	var len;
	//继承上周目的开关，比如948是墨轩提醒，968是全CG开启状态
	var gss = [948, 968];
	len = gss.length;
	for (var i = 0; i < len; i++) {
		$gameSwitches.setValue(gss[i], contents.switches._data[gss[i]]);
	}
	//继承上周目的变量，比如714是总周目次数
	var gvs = [714];
	len = gvs.length;
	for (var i = 0; i < len; i++) {
		$gameVariables.setValue(gvs[i], contents.variables._data[gvs[i]]);
	}
	//清除特殊道具，清除通关后不适合留在物品中的道具，比如69的功德包，70的精气瓶
	var items = [69, 70];
	len = items.length;
	for (var i = 0; i < len; i++) {
		$gameParty.gainItem($dataItems[items[i]], -999);
	}
	//小月需要再这里初始化在$gameSystem中加入的变量，比如下面第一个_LetterNpcData是传音人的数据。
	$gameSystem._LetterNpcData = [];

	//恢复初始服装
	$gameParty.setDurability(-100)
	$we.changeCloth($dataItems[788], '衣服', true);
	$we.changeCloth($dataItems[814], '头发', true);
	$gameActors.actor(1).changeLevel(10, true);
	$we.gameEnd = undefined;
};

DataManager.gameVersion = function() {
	var title = $dataSystem.gameTitle.split('V');
	var version = '1.000';
	if (title && title[1]) {
		version = Number(title[1].substr(0, 5));
	}
	return version;
};

var _wolfzq_DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
	_wolfzq_DataManager_setupNewGame.call(this);
	if ($gamePlayer && !$gamePlayer._version) {
		$gamePlayer._version = DataManager.gameVersion();
	}
};

var _wolfzq_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
	_wolfzq_DataManager_extractSaveContents.call(this, contents);
	if (!$gamePlayer._version) {
		//最老的版本，兼容存档需要做数据判定
		$gamePlayer._version = 1.000;
	}
	var version = DataManager.gameVersion();
	if ($gamePlayer._version < version) {
		if ($gamePlayer._version < 1.100) {
			//如果在2周目，则等级归零
			if ($gameVariables.value(714) > 0) {
				$gameActors.actor(1).changeLevel(10, true);
			}
		}
		$gamePlayer._version = version;
	}
};

(function () {
	$we = new Wolfzq_Event();
})();