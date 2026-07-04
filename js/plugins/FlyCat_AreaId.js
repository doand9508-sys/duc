//=============================================================================
// RPG Maker MZ - 地图区域Id透明度
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 飞猫工作室-<地图区域Id透明度>
 * @author 飞猫工作室（Fly_Cat/Fly_Roc）
 * 
 * @param opacity
 * @text 被遮挡位置透明度
 * @type number
 * @default 100
 * 
 * @param areaId
 * @text 被遮挡区域Id
 * @type number
 * @default 50
 * 
 * @help
 * ==============================使用说明==================================
 *
 */
'use strict';
var Imported = Imported || {};
Imported.FlyCat_AreaId = true;

var FlyCat = FlyCat || {};
FlyCat.AreaId = {};
FlyCat.AreaId.parameters = PluginManager.parameters('FlyCat_AreaId');
FlyCat.AreaId.opacity = Number(FlyCat.AreaId.parameters['opacity'] || 100);
FlyCat.AreaId.areaId = Number(FlyCat.AreaId.parameters['areaId'] || 50);

FlyCat.AreaId.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function () {
    FlyCat.AreaId.Sprite_Character_update.call(this);
    if (this._character) {
        const x = this._character._x;
        const y = this._character._y;
        const value = $gameMap.regionId(x, y)
        if (value == FlyCat.AreaId.areaId) {
            if (this._character instanceof Game_Event) {
                const event = $dataMap.events[this._character._eventId];
                if (event && event.meta.不隐藏) {

                } else {
                    this.opacity = FlyCat.AreaId.opacity;
                }
            } else {
				if (!$gamePlayer.isInVehicle()) {
					this.opacity = FlyCat.AreaId.opacity;
				}
            }
        }
    }
};