//=============================================================================
// RPG Maker MZ - 隐藏对话框
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<隐藏对话框>
 * @author FlyCat
 * 
 * @help
 */
var Imported = Imported || {};
Imported.FlyCat_HideMessage = true;

var FlyCat = FlyCat || {};
FlyCat.HideMessage = {};
FlyCat.HideMessage.parameters = PluginManager.parameters('FlyCat_HideMessage');


FlyCat.HideMessage.Scene_Map_initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function () {
    FlyCat.HideMessage.Scene_Map_initialize.call(this);
    this._onTkey = false;
    Input.keyMapper['84'] = 't';
};
FlyCat.HideMessage.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function () {
    FlyCat.HideMessage.Scene_Map_update.call(this);
    if (this._messageWindow && $gameMessage.hasText()) {
        if (Input.isTriggered('t')) {
            SoundManager.playCursor();
            if (this._onTkey) {
                this._onTkey = false;
            } else {
                this._onTkey = true;
            }
        }
        if (this._onTkey) {
            this._messageWindow.hide();
            this._nameBoxWindow.hide();
        } else {
            this._messageWindow.show();
            this._nameBoxWindow.show();
        }
    } else {
        this._onTkey = false;
    }
};
