//=============================================================================
// RPG Maker MZ - EventUpdate
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<事件刷新>
 * @author Cat
 *
 * @help
 * 事件脚本：
 * const id = this._eventId;
 * const event = $gameMap.event(id);
 * event.setUpdataTime(120,'A',true);//设置120帧后打开独立开关A为true
 * event.setUpdataTime(240,'B',false);//设置120帧后关闭独立开关B为false
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_EventUpdate = true;

var Cat = Cat || {};
Cat.EventUpdate = {};
Cat.EventUpdate.parameters = PluginManager.parameters('Cat_EventUpdate');

Cat.EventUpdate.Game_Event_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function (mapId, eventId) {
    Cat.EventUpdate.Game_Event_initialize.call(this, mapId, eventId);
    this._isUpdateEvent = false;
};

Game_Event.prototype.setUpdataTime = function (time, id, type) {
    var data = {
        time: time,
        vId: id,
        lock: type
    }
    if (!$gameSystem._updateEventData[$gameMap._mapId][this._eventId]) {
        $gameSystem._updateEventData[$gameMap._mapId][this._eventId] = data
    } else {
        $gameSystem._updateEventData[$gameMap._mapId][this._eventId] = data;
    }
};

Cat.EventUpdate.Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function () {
    Cat.EventUpdate.Scene_Base_update.call(this);
    if (SceneManager._scene instanceof Scene_Map || SceneManager._scene instanceof Scene_Language) {


    } else {
        if ($gameSystem._updateEventData) {
            for (let i = 0; i < $gameSystem._updateEventData.length; i++) {

                if ($gameSystem._updateEventData[i]) {
                    for (let s = 0; s < $gameSystem._updateEventData[i].length; s++) {
                        if ($gameSystem._updateEventData[i][s] && $gameSystem._updateEventData[i][s].time > 0) {
                            $gameSystem._updateEventData[i][s].time--;
                            if ($gameSystem._updateEventData[i][s].time == 0) {
                                const id = $gameSystem._updateEventData[i][s].vId;
                                const lock = $gameSystem._updateEventData[i][s].lock;
                                const mapId = i;
                                const key = [mapId, s, id];
                                $gameSelfSwitches.setValue(key, lock);
                                $gameSystem._updateEventData[i][s] = null;
                            };
                        }
                    }
                }
            }
        }
    }
};

Cat.EventUpdate.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function () {
    Cat.EventUpdate.Scene_Map_update.call(this);
    if ($gameSystem._updateEventData) {
        for (let i = 0; i < $gameSystem._updateEventData.length; i++) {
            if ($gameSystem._updateEventData[i]) {
                for (let s = 0; s < $gameSystem._updateEventData[i].length; s++) {
                    if ($gameSystem._updateEventData[i][s] && $gameSystem._updateEventData[i][s].time > 0) {
                        $gameSystem._updateEventData[i][s].time--;
                        if ($gameSystem._updateEventData[i][s].time == 0) {
                            const id = $gameSystem._updateEventData[i][s].vId;
                            const lock = $gameSystem._updateEventData[i][s].lock;
                            const mapId = i;
                            const key = [mapId, s, id];
                            $gameSelfSwitches.setValue(key, lock);
                            $gameSystem._updateEventData[i][s] = null;
                        };
                    }
                }
            }
        }
    }
};

Cat.EventUpdate.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function () {
    Cat.EventUpdate.Scene_Map_start.call(this);
    if ($gameSystem._updateEventData == undefined) {
        $gameSystem._updateEventData = [];
    }
    if (!$gameSystem._updateEventData[$gameMap._mapId]) {
        $gameSystem._updateEventData[$gameMap._mapId] = [];
    }
};

Cat.EventUpdate.Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
Sprite_Character.prototype.initMembers = function () {
    Cat.EventUpdate.Sprite_Character_initMembers.call(this);
    this._timeDataSprite = new Sprite();
    this.addChild(this._timeDataSprite);
    this._timeDataSprite.y = -30;
    this._timeDataSprite.anchor.y = 1;
    this._timeDataSprite.anchor.x = 0.5
    this._timeDataBitmap = new Bitmap(80, 60);
    this._timeDataBitmap.textColor = ColorManager.textColor(14);
    this._timeDataBitmap.fontSize = $gameSystem.mainFontSize() + 4
};

Cat.EventUpdate.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function () {
    Cat.EventUpdate.Sprite_Character_update.call(this);
    if (this._character instanceof Game_Event && this._timeDataBitmap && this._timeDataBitmap.isReady()) {
        this._timeDataBitmap.clear();
        if ($gameSystem._updateEventData && $gameSystem._updateEventData[$gameMap._mapId] && $gameSystem._updateEventData[$gameMap._mapId][this._character._eventId]) {
            this._timeDataBitmap.drawText(Math.floor($gameSystem._updateEventData[$gameMap._mapId][this._character._eventId].time / 60), 0, 0, 80, 60, "center");
            this._timeDataSprite.bitmap = this._timeDataBitmap;
        }
    };
};