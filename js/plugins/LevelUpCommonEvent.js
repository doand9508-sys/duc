//=============================================================================
// RPG Maker MZ - 升级提示
//=============================================================================

/*:
 * @target MZ
 * @plugindesc <升级提示>
 * @author 
 * 
 * @param levelMessageData
 * @text 升级提示
 * @type struct<levelMessageData>[]
 * @default
 * 
 * @param switchMessageData
 * @text 开关提示
 * @type struct<switchMessageData>[]
 * @default
 * 
 * @help
 */

/*~struct~levelMessageData:
@param level
@text 等级
@type number
@min 1

@param eventId
@type common_event
@min 1
@text 执行公共事件id
@desc 执行公共事件id
*/

/*~struct~switchMessageData:
@param id
@text 开关id
@type switch
@min 1

@param eventId
@type common_event
@min 1
@text 执行公共事件id
@desc 执行公共事件id
*/

'use strict';
var Imported = Imported || {};
Imported.LevelUpCommonEvent = true;

var Admin = Admin || {};
Admin.LevelUpCommonEvent = {};
Admin.LevelUpCommonEvent.parameters = PluginManager.parameters('LevelUpCommonEvent');
Admin.LevelUpCommonEvent.data = JSON.parse(Admin.LevelUpCommonEvent.parameters['levelMessageData'] || '[]');
Admin.LevelUpCommonEvent.data2 = JSON.parse(Admin.LevelUpCommonEvent.parameters['switchMessageData'] || '[]');

if (Admin.LevelUpCommonEvent.data) {
    const max = Admin.LevelUpCommonEvent.data.length;
    for (let i = 0; i < max; i++) {
        Admin.LevelUpCommonEvent.data[i] = JSON.parse(Admin.LevelUpCommonEvent.data[i])
        Admin.LevelUpCommonEvent.data[i].level = JSON.parse(Admin.LevelUpCommonEvent.data[i].level) || 0;
        Admin.LevelUpCommonEvent.data[i].eventId = JSON.parse(Admin.LevelUpCommonEvent.data[i].eventId) || 0;
    };
};

if (Admin.LevelUpCommonEvent.data2) {
    const max = Admin.LevelUpCommonEvent.data2.length;
    for (let i = 0; i < max; i++) {
        Admin.LevelUpCommonEvent.data2[i] = JSON.parse(Admin.LevelUpCommonEvent.data2[i])
        Admin.LevelUpCommonEvent.data2[i].id = JSON.parse(Admin.LevelUpCommonEvent.data2[i].id) || 0;
        Admin.LevelUpCommonEvent.data2[i].eventId = JSON.parse(Admin.LevelUpCommonEvent.data2[i].eventId) || 0;
    };
};


Admin.LevelUpCommonEvent.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function () {
    Admin.LevelUpCommonEvent.Scene_Map_update.call(this);
    const max2 = Admin.LevelUpCommonEvent.data2.length;
    if (max2 > 0) {
        for (let i = 0; i < max2; i++) {
            if (Admin.LevelUpCommonEvent.data2[i]) {
                const id = Admin.LevelUpCommonEvent.data2[i].id;
                if ($gameSwitches.value(id)) {
                    $gameTemp.reserveCommonEvent(Admin.LevelUpCommonEvent.data2[i].eventId);
                    $gameSwitches.setValue(id, false)
                }
            }
        };
    };
    if ($gameParty && $gameParty.allMembers()[0]) {
        const actor = $gameParty.allMembers()[0];
        if (!actor._levelLock) {
            actor._levelLock = [];
        };
        if (actor._levelLock.length == 0) {
            return;
        }
        const levelList = actor._levelLock;
        const max = Admin.LevelUpCommonEvent.data.length;
        for (let i = 0; i < max; i++) {
            if (levelList.indexOf(Admin.LevelUpCommonEvent.data[i].level) >= 0) {
                const index = levelList.indexOf(Admin.LevelUpCommonEvent.data[i].level);
                $gameTemp.reserveCommonEvent(Admin.LevelUpCommonEvent.data[i].eventId);
                actor._levelLock.splice(index, 1);
                break;
            }
        }
    };
};

Admin.LevelUpCommonEvent.Game_Actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function () {
    Admin.LevelUpCommonEvent.Game_Actor_levelUp.call(this);
    if (this._actorId == 1) {
        if (!this._levelLock) {
            this._levelLock = [];
        };
        if (this._levelLock.indexOf(this._level) == -1) {
            this._levelLock.push(this._level);
        }
    };
};