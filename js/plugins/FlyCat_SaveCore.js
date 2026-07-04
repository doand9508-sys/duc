//=============================================================================
// RPG Maker MZ - 存档核心
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v2.0.0 FlyCat-<存档核心>
 * @author FlyCat
 *
 * @param maxFileNumber
 * @text 最大存档数量
 * @type number
 * @desc 存档数量上限
 * @default 5
 * 
 * @param commandFontSize
 * @text 存档指令字体大小
 * @type number
 * @desc 存档指令字体大小
 * @default 20
 * 
 * @param saveFileName
 * @text 存档
 * @type string
 * @desc 存档指令名字设置
 * @default 存档
 * 
 * @param infoSaveFile
 * @text 帮助栏-存档提示语
 * @type string
 * @desc 帮助栏-存档提示语
 * @default 存档至该位置
 * 
 * @param loadFileName
 * @text 读档
 * @type string
 * @desc 读档指令名字设置
 * @default 读取
 *
 * @param infoLoadFile
 * @text 帮助栏-读档提示语
 * @type string
 * @desc 帮助栏-读档提示语
 * @default 读取该位置存档
 * 
 * @param removeFileName
 * @text 删档
 * @type string
 * @desc 删档指令名字设置
 * @default 删除
 *
 * @param removeLoadFile
 * @text 帮助栏-删档提示语
 * @type string
 * @desc 帮助栏-删档提示语
 * @default 确定删除存档吗？
 * 
 * @help
 */
'use strict';
var Imported = Imported || {};
Imported.FlyCat_SaveCore = true;

var FlyCat = FlyCat || {};
FlyCat.SaveCore = {};
FlyCat.SaveCore.parameters = PluginManager.parameters('FlyCat_SaveCore');
FlyCat.SaveCore.maxFileNumber = FlyCat.SaveCore.parameters['maxFileNumber'] || 5;
FlyCat.SaveCore.commandFontSize = FlyCat.SaveCore.parameters['commandFontSize'] || 22;
FlyCat.SaveCore.saveFileName = FlyCat.SaveCore.parameters['saveFileName'] || '存档';
FlyCat.SaveCore.infoSaveFile = FlyCat.SaveCore.parameters['infoSaveFile'] || '确定存档吗？';
FlyCat.SaveCore.loadFileName = FlyCat.SaveCore.parameters['loadFileName'] || '读取';
FlyCat.SaveCore.infoLoadFile = FlyCat.SaveCore.parameters['infoLoadFile'] || '确定读取存档吗？';
FlyCat.SaveCore.removeFileName = FlyCat.SaveCore.parameters['removeFileName'] || '删除';
FlyCat.SaveCore.removeLoadFile = FlyCat.SaveCore.parameters['removeLoadFile'] || '确定删除存档吗？';

// Scene_LL_Title.prototype.commandContinue = function () {
//     // this._commandWindow.close();
//     this._flyOnCommand = 1;
//     $gameSystem._onCommandLoad = true;
//     $gameTemp._loadFile = false;
//     SceneManager.push(Scene_File);
// };
Scene_File.prototype.commandSave = function () {
    if (SceneManager._scene instanceof Scene_File) {
        this._listWindow.activate();
    } else {
        $gameTemp._loadFile = true;
        SceneManager.push(Scene_File);
    }
};
Scene_Map.prototype.needsFadeIn = function () {
    return (
        SceneManager.isPreviousScene(Scene_Battle) ||
        SceneManager.isPreviousScene(Scene_File)
    );
};
FlyCat.SaveCore.Scene_Save_initialize = Scene_Save.prototype.initialize;
Scene_Save.prototype.initialize = function () {
    FlyCat.SaveCore.Scene_Save_initialize.call(this);
    $gameTemp._oldIndex = null;
};

Scene_File.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    DataManager.loadAllSavefileImages();
    if ($gameTemp._loadFile == true) {
        this.createCommandWindow();
        this._commandWindow.deactivate();
        this.createTimeWindow();
    }
    this.createListWindow();
    this._blackImg = new Sprite();
    this._blackImg.visible = false;
    this._blackImg.bitmap = ImageManager.loadBitmap('img/menu/', 'backLay');
    this.addChild(this._blackImg);
    this.createCommandButton();
    this.createHelpWindow();
};
Scene_File.prototype.createCommandButton = function () {
    const rect = this.CommandButtonWindowRect();
    this._commandButtonWindow = new Window_CommandButtonWindow(rect);
    this._commandButtonWindow.setHandler("save", this.saveFile.bind(this));
    this._commandButtonWindow.setHandler("load", this.loadFile.bind(this));
    this._commandButtonWindow.setHandler("cancel", this.onCancel.bind(this));
    this.addChild(this._commandButtonWindow);
    this._commandButtonWindow.hide();
    this._commandButtonWindow.setListWindow(this._listWindow);
    if ($gameTemp._loadFile == false) {
        this._commandButtonWindow.select(1)
    }
    this._cancelButtonSprite = new Sprite_CancelButton();
    this.addChild(this._cancelButtonSprite);
    this._cancelButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    this._cancelButtonSprite.x = this._commandButtonWindow.x + this._commandButtonWindow.width - 55;
    this._cancelButtonSprite.y = this._commandButtonWindow.y + 6;
    this._cancelButtonSprite.setClickHandler(this.onCancel.bind(this));
    this._cancelButtonSprite.hide();
};
Scene_File.prototype.createListWindow = function () {
    const rect = this.listWindowRect();
    this._listWindow = new Window_SavefileList(rect);
    this._listWindow.setHandler("ok", this.onSave.bind(this));
    this._listWindow.setHandler("cancel", this.cancelSaveList.bind(this));
    this._listWindow.setMode(this.mode(), this.needsAutosave());
    this._listWindow.selectSavefile(this.firstSavefileId());
    this._listWindow.refresh();
    this.addChild(this._listWindow);
    if ($gameSystem._selectSaveLastIndex) {
        this._listWindow.select($gameSystem._selectSaveLastIndex);
        if ($gameSystem._selectSaveLastIndex > 4) {
            const pagination = $gameSystem._selectSaveLastIndex - 2;
            this._listWindow.smoothScrollDown(pagination);
            $gameSystem._selectSaveLastIndex = 0;
        } else {
            this._listWindow.smoothScrollUp(50);
        }
    }
};
Scene_File.prototype.cancelSaveList = function () {
    if ($gameTemp._loadFile == true) {
        this._listWindow.deactivate();
        this._commandWindow.activate();
    } else {
        if ($gameSystem._onCommandLoad == true) {
            $gameSystem._onCommandLoad = false;
            $gameTemp.setTitleStatic(false);
            SceneManager.goto(Scene_LL_Title);
        }
        else {
            SceneManager.pop();
        }
    }
};

Scene_File.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_SaveHelp(rect);
    this._helpWindow.hide();
    this.addChild(this._helpWindow);
    // if ($gameTemp._loadFile == false) {
    //     this._helpWindow.setText(this._commandButtonWindow.helpWindowText(1))
    // }
    // else {
    //     this._helpWindow.setText(this._commandButtonWindow.helpWindowText(0));
    // }
    //  this._commandButtonWindow.setHelpWindow(this._helpWindow);
};

Scene_File.prototype.removeFile = function () {
    const savefileId = this.savefileId();
    const saveName = "file" + savefileId;
    StorageManager.remove(saveName);
    DataManager._globalInfo[savefileId] = null;
    SoundManager.playSave();
    this._listWindow.refresh();
    this._listWindow.activate();
    this._commandButtonWindow.deactivate();
}

Scene_File.prototype.saveFile = function () {
    if ($gameTemp._loadFile != true) {
        SoundManager.playBuzzer();
        this._listWindow.deactivate();
        this._commandButtonWindow.activate();
        return;
    }
    if (this._listWindow.index() == 0) {
        SoundManager.playBuzzer();
        this._listWindow.deactivate();
        this._commandButtonWindow.activate();
        return;
    }
    const savefileId = this.savefileId();
    if (this.isSavefileEnabled(savefileId)) {
        this.executeSave(savefileId);
    } else {
        this.onSaveFailure();
    }
    this._commandButtonWindow.hide();
    this._helpWindow.hide();
    this._cancelButtonSprite.hide();
    this._blackImg.visible = false;
    this._listWindow.loadSaveBitmap();
    $gameSystem._selectSaveLastIndex = this._listWindow.index();
    SceneManager.goto(Scene_File);
}
FlyCat.SaveCore.DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function () {
    const info = FlyCat.SaveCore.DataManager_makeSavefileInfo.call(this);
    if ($dataMap && $dataMap.displayName) {
        info.mapName = $dataMap.displayName;
    } else {
        info.mapName = '';
    }
    info.members = $gameParty.members();
    info.actor = info.members[0];
    var bitmap = this.makeSavefileBitmap();
    if (bitmap) {
        info.snapUrl = bitmap.saveImg_toDataURL();
    }
    return info;
};

DataManager.makeSavefileBitmap = function () {
    var bitmap = SceneManager.backgroundSaveBitmap();
    if (!bitmap) {
        return null;
    }
    var newBitmap = new Bitmap(150, 80);
    newBitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, newBitmap.width, newBitmap.height);
    return newBitmap;
};

Bitmap.prototype.saveImg_toDataURL = function () {
    var png = this._canvas.toDataURL('image/png');
    var jpeg = this._canvas.toDataURL('image/jpeg');
    return (png.length < jpeg.length) ? png : jpeg;
};
Scene_File.prototype.firstSavefileId = function () {
    return 0;
};
Scene_File.prototype.loadFile = function () {
    const savefileId = this.savefileId();
    if (this.isSavefileEnabled(savefileId)) {
        this.executeLoad(savefileId);
        this._commandButtonWindow.hide();
        this._helpWindow.hide();
        this._cancelButtonSprite.hide();
        this._blackImg.visible = false;
    } else {
        this.onLoadFailure();
        this._listWindow.deactivate();
        this._commandButtonWindow.activate();
    }
}
Scene_File.prototype.onSaveFailure = function () {
    SoundManager.playBuzzer();
    this.activateListWindow();
};
Scene_File.prototype.modeSelect = function (mode) {
    this._listWindow.setMode(mode, this.needsAutosave());
    this._listWindow.selectSavefile(this.firstSavefileId(mode));
}

Scene_File.prototype.onSave = function () {
    SoundManager.playOk();
    $gameTemp._oldIndex = this._listWindow.index();
    this._listWindow.deactivate();
    this._blackImg.visible = true;
    this._commandButtonWindow.activate();
    this._commandButtonWindow.show();
    this._helpWindow.show();
    this._cancelButtonSprite.show();
    this._commandButtonWindow._lastIndexCom = -1;
    if ($gameTemp._loadFile == true) {
        this._commandButtonWindow.select(0);
    }
    else {
        this._commandButtonWindow.select(1);
    }
};
Scene_File.prototype.onCancel = function () {
    this._listWindow.activate();
    this._commandButtonWindow.deactivate();
    this._commandButtonWindow.hide();
    this._helpWindow.hide();
    this._blackImg.visible = false;
    this._cancelButtonSprite.hide();
};

Scene_File.prototype.executeSave = function (savefileId) {
    $gameSystem.setSavefileId(savefileId);
    $gameSystem.onBeforeSave();
    DataManager.saveGame(savefileId)
        .then(() => this.onSaveSuccess())
        .catch(() => this.onSaveFailure());
};

Scene_File.prototype.onSaveSuccess = function () {
    SoundManager.playSave();
    this._listWindow.refresh();
    this._listWindow.activate();
    this._commandButtonWindow.deactivate();
};

Scene_File.prototype.activateListWindow = function () {
    this._listWindow.activate();
    this._commandButtonWindow.deactivate();
};
/////////////////////Load////////////////////
Scene_File.prototype.terminate = function () {
    if (this._loadSuccess) {
        $gameSystem.onAfterLoad();
    }
};
Scene_File.prototype.executeLoad = function (savefileId) {
    DataManager.loadGame(savefileId)
        .then(() => this.onLoadSuccess())
        .catch(() => this.onLoadFailure());
};
Scene_File.prototype.onLoadSuccess = function () {
    SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};
Scene_File.prototype.onLoadFailure = function () {
    SoundManager.playBuzzer();
    this.activateListWindow();
};

Scene_File.prototype.reloadMapIfUpdated = function () {
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        const mapId = $gameMap.mapId();
        const x = $gamePlayer.x;
        const y = $gamePlayer.y;
        $gamePlayer.reserveTransfer(mapId, x, y);
        $gamePlayer.requestMapReload();
    }
};
/////////////////////////////////////////
Scene_File.prototype.CommandButtonWindowRect = function () {
    const ww = 440;
    const wh = 300;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_File.prototype.listWindowRect = function () {
    const wx = 195;
    const wy = 120;
    const ww = 1040;
    const wh = 520;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_File.prototype.helpWindowRect = function () {
    const wx = 440;
    const wy = 300;
    const ww = 400;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

////////////////////////////////////命令//////////////////////////////
function Window_CommandButtonWindow() {
    this.initialize(...arguments);
}
Window_CommandButtonWindow.prototype = Object.create(Window_Command.prototype);
Window_CommandButtonWindow.prototype.constructor = Window_CommandButtonWindow;

Window_CommandButtonWindow.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', 'tc');
    this._loadBitmap_Button_0 = ImageManager.loadBitmap('img/menu/', 'newButton_0');
    this._loadBitmap_Button_1 = ImageManager.loadBitmap('img/menu/', 'newButton_1');
    this._lastIndexCom = -2;
    this.deactivate();
};
Window_CommandButtonWindow.prototype.drawBackgroundRect = function (rect) {
};
Window_CommandButtonWindow.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};

Window_CommandButtonWindow.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady() && this._loadBitmap_Button_0 &&
        this._loadBitmap_Button_0.isReady() && this._loadBitmap_Button_1 && this._loadBitmap_Button_1.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};
Window_CommandButtonWindow.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.drawCursorBitmap(rect, index);
    //this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = FlyCat.SaveCore.commandFontSize;
    if (!this.isCommandEnabled(index)) {
        if (index == 0) {
            this.changeTextColor('#e9e7e6');
            this.contents.outlineColor = '#c54127';
            this.contents.outlineWidth = 2;
            if (index == this.index()) {
                this.contents.fontSize = Number(FlyCat.SaveCore.commandFontSize) + 4;
            }
        } else {
            if (index == this.index()) {
                this.contents.fontSize = Number(FlyCat.SaveCore.commandFontSize) + 4;
            }
            this.changeTextColor('#e9e7e6');
            this.contents.outlineColor = '#c78e36';
            this.contents.outlineWidth = 2;
        }
    }
    else if (index == this.index()) {
        this.contents.fontSize = Number(FlyCat.SaveCore.commandFontSize) + 4;
        if (index == 0) {
            if (!$gameTemp._loadFile) {
                this.changeTextColor('#e9e7e6');
                this.contents.outlineColor = '#c54127';
                this.contents.outlineWidth = 2;
            } else {
                this.changeTextColor('#ffffff');
                this.contents.outlineColor = '#c54127';
                this.contents.outlineWidth = 2;
            }

        } else {
            if (SceneManager._scene._listWindow.index() >= 0) {
                if (!DataManager._globalInfo[SceneManager._scene._listWindow.index()]) {
                    this.changeTextColor('#e9e7e6');
                    this.contents.outlineColor = '#c78e36';
                    this.contents.outlineWidth = 2;
                } else {
                    this.changeTextColor('#ffffff');
                    this.contents.outlineColor = '#c78e36';
                    this.contents.outlineWidth = 2;
                }
            } else {
                this.changeTextColor('#ffffff');
                this.contents.outlineColor = '#c78e36';
                this.contents.outlineWidth = 2;
            }
        }
    } else {
        if (index == 0) {
            this.changeTextColor('#e9e7e6');
            this.contents.outlineColor = '#c54127';
            this.contents.outlineWidth = 2;
        } else {
            this.changeTextColor('#e9e7e6');
            this.contents.outlineColor = '#c78e36';
            this.contents.outlineWidth = 2;
        }
    }
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
FlyCat.SaveCore.Window_CommandButtonWindow_drawAllItems = Window_CommandButtonWindow.prototype.drawAllItems;
Window_CommandButtonWindow.prototype.drawAllItems = function () {
    this.drawBackBitmap();
    FlyCat.SaveCore.Window_CommandButtonWindow_drawAllItems.call(this);
};
Window_CommandButtonWindow.prototype.drawCursorBitmap = function (rect, index) {
    if (index == 0) {
        var bitmap = this._loadBitmap_Button_0;
    } else {
        var bitmap = this._loadBitmap_Button_1;
    }
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 31;
        const dy = rect.y - 1;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_CommandButtonWindow.prototype.drawBackBitmap = function () {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = 0;
        const dy = 0;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_CommandButtonWindow.prototype.makeCommandList = function () {
    this.contents.fontSize = FlyCat.SaveCore.commandFontSize;
    this.addCommand(FlyCat.SaveCore.saveFileName, "save", $gameTemp._loadFile);
    this.addCommand(FlyCat.SaveCore.loadFileName, "load", true);
    //  this.addCommand(FlyCat.SaveCore.removeFileName, "remove", true);
}
Window_CommandButtonWindow.prototype.maxItems = function () {
    return 2;
};
Window_CommandButtonWindow.prototype.numVisibleRows = function () {
    return 1;
};
Window_CommandButtonWindow.prototype.maxCols = function () {
    return 2;
};
Window_CommandButtonWindow.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_CommandButtonWindow.prototype.setListWindow = function (object) {
    this._setListWindow = object;
};
Window_CommandButtonWindow.prototype.setHelpWindow = function (object) {
    this._setHelpWindow = object;
};

FlyCat.SaveCore.Window_CommandButtonWindow_select = Window_CommandButtonWindow.prototype.select;
Window_CommandButtonWindow.prototype.select = function (index) {
    FlyCat.SaveCore.Window_CommandButtonWindow_select.call(this, index)
    if (index >= 0 && index != this._lastIndexCom && this._setListWindow) {
        this._fileIndex = index;
        this._lastIndexCom = index;
        if (index == 0) {
            this._setListWindow.setMode("save", $gameSystem.isAutosaveEnabled());
            this._setListWindow.selectSavefile($gameTemp._oldIndex);
            this._setListWindow.refresh();
            //   this._setHelpWindow.setText(this.helpWindowText(0), 0);
        }
        if (index == 1) {
            this._setListWindow.setMode("load", $gameSystem.isAutosaveEnabled())
            this._setListWindow.selectSavefile($gameTemp._oldIndex);
            this._setListWindow.refresh();
            //    this._setHelpWindow.setText(this.helpWindowText(1));
        }
        if (index == 2) {
            //      this._setHelpWindow.setText(this.helpWindowText(2));
            this._setListWindow.setMode("remove", $gameSystem.isAutosaveEnabled())
            this._setListWindow.selectSavefile($gameTemp._oldIndex);
            this._setListWindow.refresh();
        }
    }
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};
Window_CommandButtonWindow.prototype.itemRect = function (index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight() / 3;
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY() + this.itemHeight() / 3 * 1.8;
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};


function Window_SaveHelp() {
    this.initialize(...arguments);
}

Window_SaveHelp.prototype = Object.create(Window_Help.prototype);
Window_SaveHelp.prototype.constructor = Window_SaveHelp;

Window_SaveHelp.prototype.initialize = function (rect) {
    Window_Help.prototype.initialize.call(this, rect);
};
/////////////////////////////////帮助/////////////////////////////
Window_SaveHelp.prototype.refresh = function () {
    this.opacity = 0;
    this.contents.fontSize = 24;
    const rect = this.baseTextRect();
    this.contents.clear();
    this.changeTextColor('#4a6d6c');
    this.contents.outlineColor = this.contents.textColor;
    this.contents.outlineWidth = 1;

    if (!$gameTemp._loadFile && this._type == 0) {
        this.drawText(this._text, rect.x, rect.y, rect.width, 'center');
        this.contents.fontSize = 18;
        this.drawText('（存档模式无法使用，请在游戏中存档）', rect.x, rect.y + 30, rect.width, 'center');
    } else {
        if (this._type != 0 && SceneManager._scene._listWindow && SceneManager._scene._listWindow.savefileId() >= 0 && SceneManager._scene.isSavefileEnabled(SceneManager._scene._listWindow.savefileId()) == false) {
            this.drawText(this._text, rect.x, rect.y, rect.width, 'center');
            this.contents.fontSize = 18;
            this.drawText('（无法读取，该位置没有存档）', rect.x, rect.y + 30, rect.width, 'center');
        } else {
            this.drawText(this._text, rect.x, rect.y + 5, rect.width, 'center');
        }
    }
};
Window_SaveHelp.prototype.update = function () {
    Window_Help.prototype.update.call(this);
    if (SceneManager._scene._commandButtonWindow) {
        const command = SceneManager._scene._commandButtonWindow;
        const index = command.index();
        if (index >= 0) {
            this.setText(this.helpWindowText(index), index);
        }
    }
};
Window_SaveHelp.prototype.setText = function (text, type) {
    //  if (this._text !== text) {
    this._text = text;
    this._type = type;
    this.refresh();
    // }
};
Window_Base.prototype.helpWindowText = function (index) {
    if (index == 0) {
        return FlyCat.SaveCore.infoSaveFile;
    }
    if (index == 1) {
        return FlyCat.SaveCore.infoLoadFile;
    }
    if (index == 2) {
        return FlyCat.SaveCore.removeLoadFile;
    }
};
/*存档*/
FlyCat.SaveCore.Window_SavefileList_initialize = Window_SavefileList.prototype.initialize
Window_SavefileList.prototype.initialize = function (rect) {
    this.loadSaveBitmap();
    FlyCat.SaveCore.Window_SavefileList_initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', '存档列表框');
    this.createCursorSprite();
};
Window_SavefileList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'addCursor');
    this._cursorSprites.scale.set(0.8);
    this._clientArea.addChild(this._cursorSprites);
};
Window_SavefileList.prototype.loadSaveBitmap = function () {
    if (!this._loadSaveBitmap) this._loadSaveBitmap = [];
    if (DataManager._globalInfo) {
        for (let i = 0; i < DataManager._globalInfo.length; i++) {
            if (DataManager._globalInfo[i]) {
                if (DataManager._globalInfo[i].snapUrl) {
                    if (Utils.hasEncryptedImages()) {
                        var Uts = Utils.hasEncryptedImages();
                        Utils._hasEncryptedImages = false;
                        this._loadSaveBitmap[i] = ImageManager.loadBitmapFromUrl(DataManager._globalInfo[i].snapUrl);
                        Utils._hasEncryptedImages = Uts;
                    } else {
                        this._loadSaveBitmap[i] = ImageManager.loadBitmapFromUrl(DataManager._globalInfo[i].snapUrl);
                    }

                } else {
                    DataManager._globalInfo[i].snapUrl = '';
                    this._loadSaveBitmap[i] = null;
                }
            }
        };
    }
    this._loadingPictrue = false;
};

FlyCat.SaveCore.Window_SavefileList_select = Window_SavefileList.prototype.select;
Window_SavefileList.prototype.select = function (index) {
    FlyCat.SaveCore.Window_SavefileList_select.call(this, index);
    if (index != this._lastIndex) {
        // this._loadingPictrue = false;
        this.refresh();
        this._lastIndex = index;
    }
};
Window_SavefileList.prototype.updateLoading = function () {
    for (let i = 0; i < this._loadSaveBitmap.length; i++) {
        if (this._loadSaveBitmap[i] && !this._loadSaveBitmap[i].isReady()) {
            return false;
        }
    }
    return true;
}
Window_SavefileList.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady() && this.updateLoading()) {
        this.refresh();
        this._loadingPictrue = true;
    };
};
Window_SavefileList.prototype.drawItem = function (index) {
    const savefileId = this.indexToSavefileId(index);
    const info = DataManager.savefileInfo(savefileId);
    const rect = this.itemRectWithPadding(index);
    this.resetTextColor();
    this.drawCursorBitmap(rect);
    //  this.changePaintOpacity(this.isEnabled(savefileId));
    if (index == this.index()) {
        this.changeTextColor('#8c6d4c');
        this.contents.outlineColor = '#aa865f';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#4e7574';
        this.contents.outlineWidth = 1;
    }
    this.drawTitle(savefileId, rect.x, rect.y + 4);
    if (info) {
        this.drawContents(info, rect);
    }
};
Window_SavefileList.prototype.drawBackgroundRect = function (rect) {
};

Window_SavefileList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y + 20;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_SavefileList.prototype.drawTitle = function (savefileId, x, y) {
    // if (this.isEnabled(savefileId) ) {
    //     this.changeTextColor('#4a6d6c');
    //     this.contents.outlineColor = this.contents.textColor;
    //     this.contents.outlineWidth = 1;
    // } else {
    //     this.resetTextColor();
    //     this.contents.outlineColor = ColorManager.outlineColor();
    //     this.contents.outlineWidth = 2;
    // }
    this.drawSaveBitmap(x, y, savefileId)
    if (savefileId === 0) {
        this.drawText(TextManager.autosave, x, y, 180);
    } else {
        this.drawText(TextManager.file + " " + savefileId, x, y, 180);
    }
    if (DataManager._globalInfo[savefileId] && DataManager._globalInfo[savefileId].actor) {
        const actorName = DataManager._globalInfo[savefileId].actor._name;
        this.drawText('人物：' + actorName, x + 260, y, 180);
    };
    if (DataManager._globalInfo[savefileId]) {
        if (DataManager._globalInfo[savefileId].mapName) {
            var mapName = DataManager._globalInfo[savefileId].mapName;
            this.drawText('地点：' + mapName, 787 - 30, y + 14, this.itemWidth(), 'left');
        } else {
            DataManager._globalInfo[savefileId].mapName = '';
        }
    }
};
Window_SavefileList.prototype.drawPlaytime = function (info, x, y, width) {
    if (info.playtime) {
        this.drawText('游戏时间：' + info.playtime, x - 30, y, width, "right");
    }
};
Window_SavefileList.prototype.drawSaveBitmap = function (x, y, savefileId) {
    if (DataManager._globalInfo[savefileId] && !DataManager._globalInfo[savefileId].snapUrl) return;
    const bitmap = this._loadSaveBitmap[savefileId];
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = x + 100;
        const dy = y + 3;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_SavefileList.prototype.drawPartyCharacters = function (info, x, y) {
    if (info.characters) {
        let characterX = x + 100;
        for (const data of info.characters) {
            this.drawCharacter(data[0], data[1], characterX, y);
            characterX += 48;
        }
    }
};
Window_SavefileList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 10;
        const dy = rect.y + 5;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};


function Sprite_CancelButton() {
    this.initialize(...arguments);
}
Sprite_CancelButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_CancelButton.prototype.constructor = Sprite_CancelButton;

Sprite_CancelButton.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._lastBimap = null;
    this._pressCounts = 0;
};

Sprite_CancelButton.prototype.onClick = function () {
    SoundManager.playCancel()
    if (this._clickHandler) {
        this._clickHandler();
    }
};
Sprite_CancelButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    if (!this.visible) {
        this._colorTone = [0, 0, 0, 0]
        this._updateColorFilter();
    }
};
Sprite_CancelButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};
Sprite_CancelButton.prototype.onMouseEnter = function () {
    SoundManager.playCursor();
    this._colorTone = [50, 50, 50, 0]
    this._updateColorFilter();
};
Sprite_CancelButton.prototype.onMouseExit = function () {
    this._colorTone = [0, 0, 0, 0]
    this._updateColorFilter();
};
//////////////////////////////////Data///////////////////////////
DataManager.maxSavefiles = function () {
    return FlyCat.SaveCore.maxFileNumber;
};
