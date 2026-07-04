//=============================================================================
// RPG Maker MZ - 隐藏地图CG
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<隐藏地图CG>
 * @author FlyCat
 * @help
 * 
 */
'use strict';
var Imported = Imported || {};
Imported.FlyCat_AnimationOptions = true;

var FlyCat = FlyCat || {};
FlyCat.HideMapCg = {};
FlyCat.HideMapCg.parameters = PluginManager.parameters('FlyCat_HideMapCg');

ConfigManager.HideMapCg = true;
ConfigManager.HideHyCg = true;

FlyCat.HideMapCg.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function () {
    const config = FlyCat.HideMapCg.ConfigManager_makeData.call(this);
    config.HideMapCg = this._HideMapCg;
    config.HideHyCg = this._HideHyCg;
    return config;
};
FlyCat.HideMapCg.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function (config) {
    FlyCat.HideMapCg.ConfigManager_applyData.call(this, config)
    this._HideMapCg = this.readHideMapCg(config, "HideMapCg");
    this._HideHyCg = this.readHideMapCg(config, "HideHyCg");
};
ConfigManager.readHideMapCg = function (config, name) {
    if (name in config) {
        return config[name];
    } else {
        return null;
    }
};
if (Imported.FlyCat_SaveCore) {
    FlyCat.HideMapCg.Scene_File_executeSave = Scene_File.prototype.executeSave;
    Scene_File.prototype.executeSave = function (savefileId) {
        DataManager.SaveMapCg();
        FlyCat.HideMapCg.Scene_File_executeSave.call(this, savefileId)
    };
    FlyCat.HideMapCg.Scene_File_onLoadSuccess = Scene_File.prototype.onLoadSuccess;
    Scene_File.prototype.onLoadSuccess = function () {
        DataManager.LoadMapCg();
        FlyCat.HideMapCg.Scene_File_onLoadSuccess.call(this);
    };
};
FlyCat.HideMapCg.DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function () {
    FlyCat.HideMapCg.DataManager_setupNewGame.call(this);
    DataManager.LoadMapCg();
};

DataManager.SaveMapCg = function () {
    ConfigManager._HideMapCg = ConfigManager.HideMapCg;
    ConfigManager._HideHyCg = ConfigManager.HideHyCg;
    ConfigManager.save();
};
DataManager.LoadMapCg = function () {
    ConfigManager.HideMapCg = ConfigManager._HideMapCg;
    $gameSystem._mapCgVisible = ConfigManager.HideMapCg;
    ConfigManager.HideHyCg = ConfigManager._HideHyCg;
    $gameSystem._hyCgVisible = ConfigManager._HideHyCg;
};
FlyCat.HideMapCg.Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function () {
    FlyCat.HideMapCg.Window_Options_addGeneralOptions.call(this);
    this.addCommand('地图立绘开关', "HideMapCg", true);
    this.addCommand('子宫内视图开关', "HideHyCg", true);
};
FlyCat.HideMapCg.Window_Options_processOk = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function () {
    const indexs = this.index();
    const symbols = String(this.commandSymbol(indexs));
    if (symbols == 'HideMapCg') {
        $gameSystem._mapCgVisible = $gameSystem._mapCgVisible ? false : true;
    }
    if (symbols == 'HideHyCg') {
        $gameSystem._hyCgVisible = $gameSystem._hyCgVisible ? false : true;
    }
    FlyCat.HideMapCg.Window_Options_processOk.call(this)

};
FlyCat.HideMapCg.Window_Options_cursorRight = Window_Options.prototype.cursorRight
Window_Options.prototype.cursorRight = function () {
    const indexs = this.index();
    const symbols = String(this.commandSymbol(indexs));
    if (symbols == 'HideMapCg') {
        $gameSystem._mapCgVisible = $gameSystem._mapCgVisible ? false : true;
    }
    if (symbols == 'HideHyCg') {
        $gameSystem._hyCgVisible = $gameSystem._hyCgVisible ? false : true;
    }
    FlyCat.HideMapCg.Window_Options_cursorRight.call(this)
};
FlyCat.HideMapCg.Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
Window_Options.prototype.cursorLeft = function () {
    const indexs = this.index();
    const symbols = String(this.commandSymbol(indexs));
    if (symbols == 'HideMapCg') {
        $gameSystem._mapCgVisible = $gameSystem._mapCgVisible ? false : true;
    }
    if (symbols == 'HideHyCg') {
        $gameSystem._hyCgVisible = $gameSystem._hyCgVisible ? false : true;
    }
    FlyCat.HideMapCg.Window_Options_cursorLeft.call(this)
};
Window_Options.prototype.booleanStatusText = function (value) {
    return value ? "开启" : "关闭";
};
