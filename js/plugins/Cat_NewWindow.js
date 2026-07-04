//=============================================================================
// RPG Maker MZ - Ui重置-窗口
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<Ui重置-窗口>
 * @author Cat
 * 
 * @help
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_NewWindow = true;

var Cat = Cat || {};
Cat.NewWindow = {};
Cat.NewWindow.parameters = PluginManager.parameters('Cat_NewWindow');

/*Window*/
/*Window_MenuCommand*/
Window_MenuCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.activate();
    this.opacity = 0;
    this._loadingPictrue = false;
    this.createCursorSprite();
};

Window_MenuCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/menu/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_MenuCommand.prototype.select = function (index) {
    this._index = index;
    this.refreshCursor();
    this.callUpdateHelp();
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};

Window_MenuCommand.prototype.numVisibleRows = function () {
    return 11;
};

Window_MenuCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_MenuCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y - 2;
    if (this.index() >= 0) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y + 6;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_MenuCommand.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue) {
        this.refresh();
        if (Window_MenuCommand._lastProcessIndex) {
            this.select(Window_MenuCommand._lastProcessIndex);
        } else {
            this.select(0);
        }
        this._loadingPictrue = true;
    }
};

Window_MenuCommand.prototype.processOk = function () {
    Window_MenuCommand._lastProcessIndex = this.index();
    Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_MenuCommand.prototype.addSaveCommand = function () {
    if (this.needsCommand("save")) {
        const enabled = this.isSaveEnabled();
        this.addCommand('读取进度', "load", enabled);
        this.addCommand('保存进度', "save", enabled);
    }
};

Window_MenuCommand.prototype.addGameEndCommand = function () {

};

Window_MenuCommand.prototype.addMainCommands = function () {
    const enabled = this.areMainCommandsEnabled();
    if (this.needsCommand("status")) {
        this.addCommand('人物信息', "status", enabled);
    }
    if (this.needsCommand("item")) {
        this.addCommand('空间戒指', "item", enabled);
    }
    if (this.needsCommand("equip")) {
        this.addCommand("装备状态", "equip", enabled);
    }
    if (this.needsCommand("skill")) {
        this.addCommand("技能玉石", "skill", enabled);
    }
    this.addCommand("任务玉简", '任务', true);
    const smEnabled = !$gameSwitches.value(FlyCat.LL_SceneMenu.smSwitchId);
    this.addCommand("私密日记", "sm", smEnabled);
    this.addCommand("灵宠", "pet", true);
    this.addCommand("传音玉简", "cy", true);
};

Window_MenuCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 20;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(this.commandName(index), rect.x + 16, rect.y, rect.width, align);
};

Window_MenuCommand.prototype.drawBackgroundRect = function (rect) {
};

/*Window_MenuTime*/
function Window_MenuTime() {
    this.initialize(...arguments);
}

Window_MenuTime.prototype = Object.create(Window_Base.prototype);
Window_MenuTime.prototype.constructor = Window_MenuTime;

Window_MenuTime.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.refresh();
};

Window_MenuTime.prototype.refresh = function () {
    this.drawTimeText();
};

Window_MenuTime.prototype.drawTimeText = function () {
    this.contents.clear();
    this.contents.fontSize = 18;
    const year = $gameVariables.value(FlyCat.LL_SceneMenu.yearVariable);//$gameSystem._menuYear ? $gameSystem._menuYear : 0;
    const month = $gameVariables.value(FlyCat.LL_SceneMenu.monthVariable)//$gameSystem._menuMonth ? $gameSystem._menuMonth : 1;
    const weather = $gameSystem._menuWeather ? $gameSystem._menuWeather : '春';
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText("修仙纪元", 0, 6, this.width - 44, 'center');
    this.drawText(year + " 年 ", 0, 32, this.width - 44, 'center');
    this.drawText(month + "月（" + weather + '）', 5, 58, this.width - 44, 'center');
};

/*Window_MenuLLStatus*/
function Window_MenuLLStatus() {
    this.initialize(...arguments);
}

Window_MenuLLStatus.prototype = Object.create(Window_Base.prototype);
Window_MenuLLStatus.prototype.constructor = Window_MenuLLStatus;

Window_MenuLLStatus.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._actor = $gameParty.allMembers()[0]
    this.opacity = 0;
    this._loadBitmap = [];
    this._loadBackBitmap = [];
    for (let i = 1; i < 13; i++) {
        this._loadBitmap[i] = ImageManager.loadBitmap('img/newUi/menu/', 'g_' + i);
    }
    this._loadingPictrue = false;
};

Window_MenuLLStatus.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (!this._loadingPictrue && this.updateLoading()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_MenuLLStatus.prototype.updateLoading = function () {
    for (let i = 1; i < 13; i++) {
        if (this._loadBitmap[i] && !this._loadBitmap[i].isReady()) {
            return false;
        }
    }
    return true;
}

Window_MenuLLStatus.prototype.refresh = function () {
    this.contents.clear();
    const actor = this._actor;
    const width = this.width;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 26;
    var x = 10;
    var y = 0;
    this.drawText('姓名：' + actor.name(), x, y, width, 'left');
    this.drawText('等级：' + actor.level, x + 200, y, width, 'left');
    const llLevelName = $gameSystem.LLlevelName(actor.level);
    y += 30;
    this.drawText("境界：", x, y, width, "left");
    this.drawText(llLevelName, x + 56, y, 156, "center");
    this.contents.fontSize = 22;
    y += 34;
    this.drawText("生命：", x, y, width, "left");
    this.drawHmtepBitmap(x + 80, y + 10, actor.hp, actor.mhp, 1);
    y += 28;
    this.drawText("灵力：", x, y, width, "left");
    this.drawHmtepBitmap(x + 80, y + 10, actor.mp, actor.mmp, 3);
    y += 28;
    this.drawText("怒气：", x, y, width, "left");
    this.drawHmtepBitmap(x + 80, y + 10, actor.tp, 100, 5);
    y += 28;
    this.drawText("经验：", x, y, width, "left");
    const nowExp = actor.currentExp() - actor.currentLevelExp();
    const maxExp = actor.nextLevelExp() - actor.currentLevelExp();
    this.drawHmtepBitmap(x + 80, y + 10, nowExp, maxExp, 7);
    y += 36;
    if (FlyCat.LL_SceneMenu.corruptValue) {
        var corruptValue = $gameVariables.value(FlyCat.LL_SceneMenu.corruptValue);
    } else {
        var corruptValue = 0;
    }
    var dl_1 = $gameSwitches.value(FlyCat.LL_SceneMenu.dlSwitchId_1);
    var dl_2 = $gameSwitches.value(FlyCat.LL_SceneMenu.dlSwitchId_2);
    var dl_3 = $gameSwitches.value(Cat.NewSceneMenu.dlSwitchId_3);
    var dl_4 = $gameSwitches.value(Cat.NewSceneMenu.dlSwitchId_4);
    if (corruptValue < 0) var corruptValue = 0;
    if (corruptValue >= 99 && dl_1 == false) var corruptValue = 99;
    if (corruptValue >= 500 && dl_2 == false) var corruptValue = 500;
    if (corruptValue >= 1000 && dl_3 == false) var corruptValue = 1000;
    if (corruptValue >= 1500 && dl_4 == false) var corruptValue = 1500;
    $gameVariables.setValue(FlyCat.LL_SceneMenu.corruptValue, corruptValue)
    if (corruptValue <= 99 && dl_1 == false) {
        var maxValue = 99;
    } else if (corruptValue <= 500 && dl_2 == false) {
        var maxValue = 500;
    } else if (corruptValue <= 1000 && dl_3 == false) {
        var maxValue = 1000;
    } else if (corruptValue <= 1500 && dl_4 == false) {
        var maxValue = 1500;
    } else {
        var maxValue = 2000;
    }
    this.drawText("恶堕度：", x, y, width, "left");
    this.drawHmtepBitmap(x + 80, y + 10, corruptValue, maxValue, 9);
    y += 28;
    if (FlyCat.LL_SceneMenu.xmValue) {
        var xmValue = $gameVariables.value(FlyCat.LL_SceneMenu.xmValue);
        if (xmValue < 0) var xmValue = 0;
        if (xmValue >= 1000) var xmValue = 1000;
    } else {
        var xmValue = 0;
    }
    $gameVariables.setValue(FlyCat.LL_SceneMenu.xmValue, xmValue)
    this.drawText("心魔：", x, y, width, "left");
    this.drawHmtepBitmap(x + 80, y + 10, xmValue, 1000, 11);
    y += 28;
    var gongdeVariable = 0;
    if (FlyCat.LL_SceneMenu.gongdeVariable) {
        var gongdeVariable = $gameVariables.value(FlyCat.LL_SceneMenu.gongdeVariable);
        if (gongdeVariable < 0) {
            gongdeVariable = 0;
            $gameVariables.setValue(FlyCat.LL_SceneMenu.gongdeVariable, 0)
        } else if (gongdeVariable > 9999) {
            gongdeVariable = 9999;
            $gameVariables.setValue(FlyCat.LL_SceneMenu.gongdeVariable, 9999)
        }
    }
    this.drawText("功德值：" + gongdeVariable, x, y, width, "left");
    if (FlyCat.LL_SceneMenu.jingqiVariable) {
        var jingqiVariable = $gameVariables.value(FlyCat.LL_SceneMenu.jingqiVariable);
        if (jingqiVariable < 0) {
            var jingqiVariable = 0;
            $gameVariables.setValue(FlyCat.LL_SceneMenu.jingqiVariable, 0)
        }
        if (jingqiVariable > 999) {
            var jingqiVariable = 1000;
            $gameVariables.setValue(FlyCat.LL_SceneMenu.jingqiVariable, 1000)
        }
    } else {
        var jingqiVariable = 0;
    }
    this.drawText("精气进度：" + jingqiVariable, x + 200, y, width, "left");
    y += 28;
    if (FlyCat.LL_SceneMenu.pregnancyValue) {
        var pregnancyValue = $gameVariables.value(FlyCat.LL_SceneMenu.pregnancyValue);
        if (pregnancyValue < 0) {
            var pregnancyValue = 0;
            $gameVariables.setValue(FlyCat.LL_SceneMenu.pregnancyValue, 0)
        }
        if (pregnancyValue > 99) {
            var pregnancyValue = 100;
            $gameVariables.setValue(FlyCat.LL_SceneMenu.pregnancyValue, 100)
        }
    } else {
        var pregnancyValue = 0;
    }
    this.drawText("孕值：" + pregnancyValue, x, y, width, "left");
    if ($gameSystem._menuTearPeopleName) {
        var name = $gameSystem._menuTearPeopleName;
    } else {
        var name = '未破处';
    }
    this.drawText("破处者：" + name, x + 200, y, width, "left");
    y += 28;
    const reputationText = $gameSystem._menuReputationText || "无";
    this.drawText("声望：" + reputationText, x, y, width, "left");
    const remarkText = $gameSystem._menuRemarkText || "无";
    this.drawText("风评：" + remarkText, x + 200, y, width, "left");
    y += 32;
    this.drawText("人物状态&特性：", x, y, width, "left");
    y += 32;
    for (let i = 0; i < actor.states().length; i++) {
        if (actor.states()[i]) {
            if (i % 2 == 1) {
                var x = 192;
            } else {
                var x = 10;
            };
            const state = actor.states()[i];
            this.drawText(state.name, x, y, width, "left");
            if (i % 2 == 1) {
                y += 28
            }
        };
    };
};

Window_MenuLLStatus.prototype.drawHmtepBitmap = function (x, y, now, max, id) {
    const bitmap = this._loadBitmap[id];
    const backBitmap = this._loadBitmap[id + 1];
    const rate = now / max;
    if (bitmap && backBitmap) {
        const pw = Math.floor(bitmap.width * rate);
        const ph = bitmap.height;
        const dx = x;
        const dy = y + 2;
        const sx = 0;
        const sy = 0;
        this.contents.blt(backBitmap, sx, sy, backBitmap.width, backBitmap.height, dx, dy);
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 16;
    this.contents.fontFace = $gameSystem.mainFontFace();
    var text = '';
    if (id == 9) {
        if (now <= 99) var text = "（一阶段）";
        if (now > 99) var text = "（二阶段）";
        if (now > 500) var text = "（三阶段）";
        if (now > 1000) var text = "（四阶段）";
        if (now > 1500) var text = "（五阶段）";
    }
    this.drawText(now + '/' + max + text, x, y - 10 + 2, 272, 'center');
    this.contents.fontSize = 22;
};

/*Window_GoldLs*/
function Window_GoldLs() {
    this.initialize(...arguments);
}

Window_GoldLs.prototype = Object.create(Window_Base.prototype);
Window_GoldLs.prototype.constructor = Window_GoldLs;

Window_GoldLs.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._actor = $gameParty.allMembers()[0];
    this.opacity = 0;
    this.refresh();
};

Window_GoldLs.prototype.refresh = function () {
    this.contents.clear();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 30;
    if (FlyCat.LL_SceneMenu.goldItem) {
        var goldItem = $dataItems[FlyCat.LL_SceneMenu.goldItem]
        var goldItemNumber = $gameParty.numItems(goldItem);
    } else {
        var goldItemNumber = 0;
    }
    this.drawText(goldItemNumber, 10, 5, 170, "right");
    this.drawText($gameParty.gold(), 280, 5, 170, "right");
};

/*Window_NewItemCategory*/
function Window_NewItemCategory() {
    this.initialize(...arguments);
}

Window_NewItemCategory.prototype = Object.create(Window_HorzCommand.prototype);
Window_NewItemCategory.prototype.constructor = Window_NewItemCategory;

Window_NewItemCategory.prototype.initialize = function (rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
    this.select(0);
    this.activate();
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/item/', '道具底板');
    this.createCursorSprite();
};

Window_NewItemCategory.prototype.select = function (index) {
    this._index = index;
    this.refreshCursor();
    this.callUpdateHelp();
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};

Window_NewItemCategory.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/item/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_NewItemCategory.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        if (this.index() == 0) {
            var ofx = -15;
        } else if (this.index() == 3) {
            var ofx = -25;
        } else if (this.index() == 4) {
            var ofx = -35;
        } else {
            var ofx = 0;
        }
        // this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 14 + ofx;
        this._cursorSprites.y = this._cursorSprite.y + 18;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_NewItemCategory.prototype.update = function () {
    Window_HorzCommand.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
    }
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_NewItemCategory.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 26;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(this.commandName(index), rect.x + 8, rect.y, rect.width, 'center');
};

Window_NewItemCategory.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_NewItemCategory.prototype.numVisibleRows = function () {
    return 1;
};

Window_NewItemCategory.prototype.drawBackgroundRect = function (rect) {
};

Window_NewItemCategory.prototype.maxCols = function () {
    return 5;
};

Window_NewItemCategory.prototype.makeCommandList = function () {
    this.addCommand('普通道具', "item");
    this.addCommand('丹药', "item2");
    this.addCommand('秘籍', "item3");
    this.addCommand('武器护具', "armorweapon");
    this.addCommand('珍贵道具', "keyItem");
    //  this.addCommand('返回', "cancel");
};

Window_NewItemCategory.prototype.setItemWindow = function (itemWindow) {
    this._itemWindow = itemWindow;
};

Window_NewItemCategory.prototype.needsSelection = function () {
    return this.maxItems() >= 2;
};

/*Window_NewItemList*/
function Window_NewItemList() {
    this.initialize(...arguments);
}

Window_NewItemList.prototype = Object.create(Window_Selectable.prototype);
Window_NewItemList.prototype.constructor = Window_NewItemList;

Window_NewItemList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._category = "none";
    this._data = [];
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/item/', '道具底板');
    this.createCursorSprite();
};

Window_NewItemList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/item/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_NewItemList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_NewItemList.prototype.select = function (index) {
    this._index = index;
    this.refreshCursor();
    this.callUpdateHelp();
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};

Window_NewItemList.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._loadingPictrue = false;
        this.scrollTo(0, 0);
    }
};

Window_NewItemList.prototype.maxCols = function () {
    return 2;
};

Window_NewItemList.prototype.colSpacing = function () {
    return 16;
};

Window_NewItemList.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
};

Window_NewItemList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_NewItemList.prototype.numVisibleRows = function () {
    return 4;
};

Window_NewItemList.prototype.item = function () {
    return this.itemAt(this.index());
};

Window_NewItemList.prototype.itemAt = function (index) {
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_NewItemList.prototype.isCurrentItemEnabled = function () {
    return this.isEnabled(this.item());
};

Window_NewItemList.prototype.includes = function (item) {
    switch (this._category) {
        case "item":
            return DataManager.isItem(item) && item.itypeId === 1 && !item.meta.宠物使用 && !item.meta.秘籍 && !item.meta.丹药;
        case "item2":
            return DataManager.isItem(item) && item.itypeId === 1 && item.meta.丹药;
        case "item3":
            return DataManager.isItem(item) && item.itypeId === 1 && item.meta.秘籍;
        case "weapon":
            return DataManager.isWeapon(item);
        case "armorweapon":
            return DataManager.isArmor(item) || DataManager.isWeapon(item);
        case "armor":
            return DataManager.isArmor(item);
        case "keyItem":
            return DataManager.isItem(item) && item.itypeId === 2 && !item.meta.宠物使用;
        default:
            return false;
    }
};

Window_NewItemList.prototype.needsNumber = function () {
    if (this._category === "keyItem") {
        return $dataSystem.optKeyItemsNumber;
    } else {
        return true;
    }
};

Window_NewItemList.prototype.isEnabled = function (item) {
    return $gameParty.canUse(item);
};

Window_NewItemList.prototype.makeItemList = function () {
    this._data = $gameParty.allItems().filter(item => this.includes(item));
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_NewItemList.prototype.selectLast = function () {
    const index = this._data.indexOf($gameParty.lastItem());
    this.forceSelect(index >= 0 ? index : 0);
};

Window_NewItemList.prototype.drawBackgroundRect = function (rect) {
};

Window_NewItemList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 8;
        this._cursorSprites.y = this._cursorSprite.y + 18;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_NewItemList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 20;
        const dy = rect.y - 12;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

Window_NewItemList.prototype.drawItem = function (index) {
    const item = this.itemAt(index);
    if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 20;
        this.drawItemName(item, rect.x + 20, rect.y + 3, rect.width - numberWidth, index);
        this.drawItemNumber(item, rect.x, rect.y + 3, rect.width, index);
    }
};

Window_NewItemList.prototype.drawItemName = function (item, x, y, width, index) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        if (!this.isEnabled(item)) {
            this.changeTextColor(ColorManager.textColor(10));//5.1
            this.contents.outlineColor = ColorManager.textColor(10);
            this.contents.outlineWidth = 1;
        } else {
            this.changeTextColor('#462a39');
            this.contents.outlineColor = '#462a39';
            this.contents.outlineWidth = 1;
        }
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};

Window_NewItemList.prototype.drawItemNumber = function (item, x, y, width) {
    if (this.needsNumber()) {
        if (!DataManager.isAloneItems(item)) {
            this.drawText("剩餘：", x, y, width - this.textWidth("00"), "right");
            this.drawText($gameParty.numItems(item), x, y, width, "right");
        }
    };
};

Window_NewItemList.prototype.numberWidth = function () {
    return this.textWidth("000");
};

Window_NewItemList.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.item());
};

Window_NewItemList.prototype.refresh = function () {
    this.makeItemList();
    Window_Selectable.prototype.refresh.call(this);
};

/*Window_MenuHpMp*/
function Window_MenuHpMp() {
    this.initialize(...arguments);
}

Window_MenuHpMp.prototype = Object.create(Window_Base.prototype);
Window_MenuHpMp.prototype.constructor = Window_MenuHpMp;

Window_MenuHpMp.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._actor = $gameParty.allMembers()[0];
    this.opacity = 0;
    this._loadBitmap = [];
    this._loadBackBitmap = [];
    for (let i = 1; i < 13; i++) {
        this._loadBitmap[i] = ImageManager.loadBitmap('img/newUi/menu/', 'g_' + i);
    }
    this._loadingPictrue = false;
};

Window_MenuHpMp.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (!this._loadingPictrue && this.updateLoading()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_MenuHpMp.prototype.updateLoading = function () {
    for (let i = 1; i < 13; i++) {
        if (this._loadBitmap[i] && !this._loadBitmap[i].isReady()) {
            return false;
        }
    }
    return true;
}

Window_MenuHpMp.prototype.refresh = function () {
    this.contents.clear();
    const actor = this._actor;
    const width = this.width;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;

    var x = 10;
    var y = 10;
    if (SceneManager._scene instanceof Scene_Skill) {
        this.contents.fontSize = 20;
        this.drawText("生命：", x, y, width, "left");
        this.drawHmtepBitmap(x + 80, y + 7, actor.hp, actor.mhp, 1);
        this.drawText("灵力：", x + 460, y, width, "left");
        this.drawHmtepBitmap(x + 80 + 460, y + 7, actor.mp, actor.mmp, 3);
    } else {
        this.contents.fontSize = 26;
        this.drawText("生命：", x, y, width, "left");
        this.drawHmtepBitmap(x + 80, y + 10, actor.hp, actor.mhp, 1);
        this.drawText("灵力：", x + 460, y, width, "left");
        this.drawHmtepBitmap(x + 80 + 460, y + 10, actor.mp, actor.mmp, 3);
    }

};

Window_MenuHpMp.prototype.drawHmtepBitmap = function (x, y, now, max, id) {
    const bitmap = this._loadBitmap[id];
    const backBitmap = this._loadBitmap[id + 1];
    const rate = now / max;
    if (bitmap && backBitmap) {
        const pw = Math.floor(bitmap.width * rate);
        const ph = bitmap.height;
        const dx = x;
        const dy = y + 2;
        const sx = 0;
        const sy = 0;
        this.contents.blt(backBitmap, sx, sy, backBitmap.width, backBitmap.height, dx, dy);
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 16;
    this.contents.fontFace = $gameSystem.mainFontFace();
    var text = '';
    if (id == 9) {
        if (now <= 99) var text = "（一阶段）";
        if (now > 99) var text = "（二阶段）";
        if (now > 500) var text = "（三阶段）";
    }
    this.drawText(now + '/' + max + text, x, y - 10 + 2, 272, 'center');
    this.contents.fontSize = 22;
};

/*Window_MiniInfo*/
Window_MiniInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this._showInfo = DrillUp.m_window_defaultState === "true";
    this.openness = 0;
    this._maxCols = 1;
};

/*Window_ItemHelp*/
function Window_ItemHelp() {
    this.initialize(...arguments);
}

Window_ItemHelp.prototype = Object.create(Window_Base.prototype);
Window_ItemHelp.prototype.constructor = Window_ItemHelp;

Window_ItemHelp.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._text = "";
    this.opacity = 0;
};

Window_ItemHelp.prototype.setText = function (text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_ItemHelp.prototype.clear = function () {
    this.setText("");
};

Window_ItemHelp.prototype.setItem = function (item) {
    this.setText(item ? item.description : "");
};

Window_ItemHelp.prototype.refresh = function () {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.drawTextEx(this._text, rect.x, rect.y, rect.width);
};
Window_ItemHelp.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 22;
    this.resetTextColor();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
};

Window_ItemHelp.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineWidth = 3;
    } else {
        this.contents.outlineWidth = 1;
    }
};

/*Window_newSavefileList*/
function Window_newSavefileList() {
    this.initialize(...arguments);
}

Window_newSavefileList.prototype = Object.create(Window_Selectable.prototype);
Window_newSavefileList.prototype.constructor = Window_newSavefileList;

Window_newSavefileList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._mapSprite = new Sprite_SaveMap();
    this._mapSprite.setWindow(this);
    this.addChild(this._mapSprite);
    this._mapSprite.x = 501;
    this._mapSprite.y = 68;
    this.windowskin = ImageManager.loadSystem("Window20");
    this.loadSaveBitmap();
    this.activate();
    this._mode = null;
    this._autosave = false;
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/save/', '条框');
    this.createCursorSprite();
};

Window_newSavefileList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/save/', 'cursor');;
    this._cursorSprites.scale.set(0.8);
    this._clientArea.addChild(this._cursorSprites);
};

Cat.NewWindow.Window_SavefileList_select = Window_SavefileList.prototype.select;
Window_newSavefileList.prototype.select = function (index) {
    Cat.NewWindow.Window_SavefileList_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};

Window_newSavefileList.prototype.updateLoading = function () {
    for (let i = 0; i < this._loadSaveBitmap.length; i++) {
        if (this._loadSaveBitmap[i] && !this._loadSaveBitmap[i].isReady()) {
            return false;
        }
    }
    return true;
}

Window_newSavefileList.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady() && this.updateLoading()) {
        this.refresh();
        this._loadingPictrue = true;
    };
};

Window_newSavefileList.prototype.loadSaveBitmap = function () {
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

Window_newSavefileList.prototype.setMode = function (mode, autosave) {
    this._mode = mode;
    this._autosave = autosave;
    this.refresh();
};

Window_newSavefileList.prototype.maxItems = function () {
    return DataManager.maxSavefiles() - (this._autosave ? 0 : 1);
};

Window_newSavefileList.prototype.numVisibleRows = function () {
    return 7;
};

Window_newSavefileList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_newSavefileList.prototype.drawItem = function (index) {
    const savefileId = this.indexToSavefileId(index);
    const info = DataManager.savefileInfo(savefileId);
    const rect = this.itemRectWithPadding(index);
    this.resetTextColor();
    this.drawCursorBitmap(rect);
    //  this.changePaintOpacity(this.isEnabled(savefileId));
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 24;
    this.drawTitle(savefileId, rect.x + 28, rect.y + 4);
    if (info) {
        this.drawContents(info, rect);
    }
};

Window_newSavefileList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 10;
        const dy = rect.y + 5;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

Window_newSavefileList.prototype.drawPlaytime = function (info, x, y, width) {
    if (info.playtime) {
        this.drawText('游戏时间：' + info.playtime, x - 30, y, width, "right");
    }
};

Window_newSavefileList.prototype.drawTitle = function (savefileId, x, y) {
    if (savefileId === 0) {
        this.drawText(TextManager.autosave, x, y, 180);
    } else {
        this.drawText(TextManager.file + " " + savefileId, x, y, 180);
    }
};

Window_newSavefileList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 4;
        this._cursorSprites.y = this._cursorSprite.y + 10;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_newSavefileList.prototype.drawBackgroundRect = function (rect) {
};

Window_newSavefileList.prototype.indexToSavefileId = function (index) {
    return index + (this._autosave ? 0 : 1);
};

Window_newSavefileList.prototype.savefileIdToIndex = function (savefileId) {
    return savefileId - (this._autosave ? 0 : 1);
};

Window_newSavefileList.prototype.isEnabled = function (savefileId) {
    if (this._mode === "save") {
        return savefileId > 0;
    } else {
        return !!DataManager.savefileInfo(savefileId);
    }
};

Window_newSavefileList.prototype.savefileId = function () {
    return this.indexToSavefileId(this.index());
};

Window_newSavefileList.prototype.selectSavefile = function (savefileId) {
    const index = Math.max(0, this.savefileIdToIndex(savefileId));
    this.select(index);
    this.setTopRow(index - 2);
};

Window_newSavefileList.prototype.drawTitle = function (savefileId, x, y) {
    if (savefileId === 0) {
        this.drawText(TextManager.autosave, x, y, 180);
    } else {
        this.drawText('档位' + " " + savefileId, x, y, 180);
    }
};

Window_newSavefileList.prototype.drawContents = function (info, rect) {
    const bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        //  this.drawPartyCharacters(info, rect.x + 220, bottom - 8);
    }
    const lineHeight = this.lineHeight();
    const y2 = bottom - lineHeight - 4;
    if (y2 >= lineHeight - 48) {
        this.drawPlaytime(info, rect.x, y2, rect.width);
    }
};

Window_newSavefileList.prototype.drawPartyCharacters = function (info, x, y) {
    if (info.characters) {
        let characterX = x;
        for (const data of info.characters) {
            this.drawCharacter(data[0], data[1], characterX, y);
            characterX += 48;
        }
    }
};

/*Window_Help*/
function Window_NewSaveHelp() {
    this.initialize(...arguments);
}

Window_NewSaveHelp.prototype = Object.create(Window_Help.prototype);
Window_NewSaveHelp.prototype.constructor = Window_NewSaveHelp;

Window_NewSaveHelp.prototype.initialize = function (rect) {
    Window_Help.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
};

Window_NewSaveHelp.prototype.refresh = function () {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 30;
    this.changeTextColor('#462a39');
    this.drawText(this._text, rect.x, rect.y, rect.width, 'center');
};

function Window_NewSkillHelp() {
    this.initialize(...arguments);
}

Window_NewSkillHelp.prototype = Object.create(Window_Help.prototype);
Window_NewSkillHelp.prototype.constructor = Window_NewSkillHelp;

Window_NewSkillHelp.prototype.initialize = function (rect) {
    Window_Help.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
};

Window_NewSkillHelp.prototype.refresh = function () {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.drawTextEx(this._text, rect.x, rect.y, rect.width);
};

Window_NewSkillHelp.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 22;
    this.resetTextColor();
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
};

Window_NewSkillHelp.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineWidth = 3;
    } else {
        this.contents.outlineWidth = 1;
    }
};

/*Window_NewEquipHelp*/
function Window_NewEquipHelp() {
    this.initialize(...arguments);
}

Window_NewEquipHelp.prototype = Object.create(Window_Help.prototype);
Window_NewEquipHelp.prototype.constructor = Window_NewEquipHelp;

Window_NewEquipHelp.prototype.initialize = function (rect) {
    Window_Help.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
};

Window_NewEquipHelp.prototype.refresh = function () {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.drawTextEx(this._text, rect.x, rect.y, rect.width);
};

Window_NewEquipHelp.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 20;
    this.resetTextColor();
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
};

Window_NewEquipHelp.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineWidth = 3;
    } else {
        this.contents.outlineWidth = 1;
    }
};

/*Window_NewSkillType*/
function Window_NewSkillType() {
    this.initialize(...arguments);
}

Window_NewSkillType.prototype = Object.create(Window_SkillType.prototype);
Window_NewSkillType.prototype.constructor = Window_NewSkillType;

Window_NewSkillType.prototype.initialize = function (rect) {
    Window_SkillType.prototype.initialize.call(this, rect);
    this.select(0);
    this.activate();
    this.opacity = 0;
    this._loadingPictrue = false;
    this.createCursorSprite();
};

Window_NewSkillType.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/skill/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_NewSkillType.prototype.update = function () {
    Window_SkillType.prototype.update.call(this);
    if (!this._loadingPictrue) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_NewSkillType.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    if (index == this.index()) {
        this.drawCursorBitmap(rect, 0)
    } else {
        this.drawCursorBitmap(rect, 1)
    }
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 30;
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
    this.drawText(this.commandName(index), rect.x, rect.y - 2, rect.width, align);
};

Window_NewSkillType.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_NewSkillType.prototype.numVisibleRows = function () {
    return 1;
};

Window_NewSkillType.prototype.drawBackgroundRect = function (rect) {
};

Window_NewSkillType.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        //    this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 40;
        this._cursorSprites.y = this._cursorSprite.y + 16;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_NewSkillType.prototype.drawCursorBitmap = function (rect, type) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height / 2;
        const dx = rect.x + 3;
        const dy = rect.y;
        const sx = 0;
        const sy = type * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

Window_NewSkillType.prototype.maxCols = function () {
    return 4;
};

Window_NewSkillType.prototype.makeCommandList = function () {
    if (this._actor) {
        const skillTypes = this._actor.skillTypes();
        for (const stypeId of skillTypes) {
            const name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, "skill", true, stypeId);
        }
        //  this.addCommand('返回', "cancel", true);
    }
};

/*Window_NewSkillList*/
function Window_NewSkillList() {
    this.initialize(...arguments);
}

Window_NewSkillList.prototype = Object.create(Window_SkillList.prototype);
Window_NewSkillList.prototype.constructor = Window_NewSkillList;

Window_NewSkillList.prototype.initialize = function (rect) {
    Window_SkillList.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.windowskin = ImageManager.loadSystem("Window20");
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/skill/', '技能框');
    this.createCursorSprite();
};

Window_NewSkillList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/skill/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_NewSkillList.prototype.update = function () {
    Window_SkillList.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_NewSkillList.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this._loadingPictrue = false;
        this.scrollTo(0, 0);
    }
};

Window_NewSkillList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_NewSkillList.prototype.numVisibleRows = function () {
    return 6;
};

Window_NewSkillList.prototype.setStypeId = function (stypeId) {
    if (this._stypeId !== stypeId) {
        this._stypeId = stypeId;
        this._loadingPictrue = false;
        this.scrollTo(0, 0);
    }
};

Window_NewSkillList.prototype.maxCols = function () {
    return 2;
};

Window_NewSkillList.prototype.colSpacing = function () {
    return 16;
};

Window_NewSkillList.prototype.drawBackgroundRect = function (rect) {
};

Window_NewSkillList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        // this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y + 4;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_NewSkillList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 10;
        const dy = rect.y - 4;
        const sx = 0;
        const sy = 0;
        const scw = rect.width;
        const sch = ph
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};

Window_NewSkillList.prototype.drawItem = function (index) {
    const skill = this.itemAt(index);
    if (skill) {
        const costWidth = this.costWidth();
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 20;
        this.drawItemName(skill, rect.x + 30, rect.y, rect.width - costWidth, index);
        this.contents.fontSize = 18;
        this.drawSkillCost(skill, rect.x, rect.y + 16, rect.width - 50);
    }
};

Window_NewSkillList.prototype.drawItemName = function (item, x, y, width, index) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        var text = '';
        if (!this.isEnabled(item)) {
            this.changeTextColor(ColorManager.textColor(10));//5.1
            this.contents.outlineColor = ColorManager.textColor(10);
            this.contents.outlineWidth = 1;
            var text = '(无法使用)';
        } else {
            this.contents.outlineColor = '#462a39';
            this.contents.outlineWidth = 1;
            this.changeTextColor('#462a39');
        }
        this.drawIcon(item.iconIndex, x, iconY + 2);
        this.drawText(item.name + text, x + textMargin, y - 4, itemWidth);
    }
};

Window_NewSkillList.prototype.drawSkillCost = function (skill, x, y, width) {
    if (this._actor.skillTpCost(skill) > 0) {
        this.drawText('消耗怒气：' + this._actor.skillTpCost(skill), x, y, width, "right");
    } else if (this._actor.skillMpCost(skill) > 0) {
        this.drawText('消耗灵力：' + this._actor.skillMpCost(skill), x, y, width, "right");
    } else {
        this.drawText('无消耗', x, y, width, "right");
    }
};

/*Window_NewEquipCommand*/
function Window_NewEquipCommand() {
    this.initialize(...arguments);
}

Window_NewEquipCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_NewEquipCommand.prototype.constructor = Window_NewEquipCommand;

Window_NewEquipCommand.prototype.initialize = function (rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
    this.createCursorSprite();
    this.opacity = 0;
};

Window_NewEquipCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/equip/', 'cursor');
    this._cursorSprites.scale.set(0.7);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_NewEquipCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        // this._cursorSprites.alpha = this._makeCursorAlpha();;
        if (this.index() == 0) {
            var ofx = 28;
        } else if (this.index() == 2) {
            var ofx = -8;
        } else {
            var ofx = 0;
        }
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 9 + ofx;
        this._cursorSprites.y = this._cursorSprite.y + 8;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_NewEquipCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_NewEquipCommand.prototype.maxCols = function () {
    return 2;
};

Window_NewEquipCommand.prototype.makeCommandList = function () {
    this.addCommand('一键最强装备', "optimize");
    this.addCommand('更换装备', "equip");
    this.addCommand('清空', "clear");
};

Window_NewEquipCommand.prototype.itemRect = function (index) {
    // const maxCols = this.maxCols();
    // const itemWidth = this.itemWidth();
    // const itemHeight = this.itemHeight();
    // const colSpacing = this.colSpacing();
    // const rowSpacing = this.rowSpacing();
    // const col = index % maxCols;
    // const row = Math.floor(index / maxCols);
    // const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    // const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    // const width = itemWidth - colSpacing;
    // const height = itemHeight - rowSpacing;
    if (index == 0) {
        var x = 0;
        var y = 0;
        var width = 304;
        var height = 49
    } else if (index == 1) {
        var x = 0;
        var y = 50;
        var width = 182;
        var height = 48;
    } else {
        var x = 182;
        var y = 50;
        var width = 122;
        var height = 48;
    }
    return new Rectangle(x, y, width, height);
};

Window_NewEquipCommand.prototype.drawBackgroundRect = function (rect) {
};

Window_NewEquipCommand.prototype.processCursorMove = function () {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("down")) {
            if (this.index() == 0) {
                this.smoothSelect(1);
            } else if (this.index() == 1) {
                this.smoothSelect(2);
            } else if (this.index() == 2) {
                this.smoothSelect(0);
            }
        }
        if (Input.isRepeated("up")) {
            if (this.index() == 0) {
                this.smoothSelect(2);
            } else if (this.index() == 1) {
                this.smoothSelect(0);
            } else if (this.index() == 2) {
                this.smoothSelect(1);
            }
        }
        if (Input.isRepeated("right")) {
            if (this.index() == 0) {
                this.smoothSelect(1);
            } else if (this.index() == 1) {
                this.smoothSelect(2);
            } else if (this.index() == 2) {
                this.smoothSelect(0);
            }
        }
        if (Input.isRepeated("left")) {
            if (this.index() == 0) {
                this.smoothSelect(2);
            } else if (this.index() == 1) {
                this.smoothSelect(0);
            } else if (this.index() == 2) {
                this.smoothSelect(1);
            }
        }
        if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
            this.cursorPagedown();
        }
        if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

/*Window_EquipSlot*/
Window_EquipSlot.prototype.initialize = function (rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
    this.opacity = 0;
    this._loadingPictrue = true;
    //  this._loadBitmap = ImageManager.loadBitmap('img/newUi/equip/', '底框');
    this.createCursorSprite();
    this.refresh();
};

Window_EquipSlot.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this._loadingPictrue = false;
    }
};

Window_EquipSlot.prototype.update = function () {
    Window_StatusBase.prototype.update.call(this);
    if (!this._loadingPictrue) {
        this.refresh();
        this._loadingPictrue = true;
    }
    if (this._itemWindow) {
        if (this._actor.actor().meta.宠物立绘) {
            this._itemWindow.setSlotId(7);
        } else {
            this._itemWindow.setSlotId(this.index());
        }
    }
};

Window_EquipSlot.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/equip/', 'cursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_EquipSlot.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        // this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 5;
        this._cursorSprites.y = this._cursorSprite.y + 18;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_EquipSlot.prototype.drawItem = function (index, index_1) {
    if (this._actor) {
        const slotName = this.actorSlotName(this._actor, index);
        const item = this.itemAt(index);
        const slotNameWidth = this.slotNameWidth();
        if (index_1 == 1) {
            var index = 0;
        }
        const rect = this.itemLineRect(index);
        const itemWidth = rect.width - slotNameWidth;
        //  this.changeTextColor(ColorManager.systemColor());
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.changeTextColor('#462a39');
        this.contents.fontSize = 24;
        this.drawText(slotName, rect.x + 20, rect.y + 2, slotNameWidth, rect.height);
        this.drawItemName(item, rect.x + slotNameWidth - 80 + 20, rect.y + 2, rect.width);
        this.changePaintOpacity(true);
    }
};

Window_EquipSlot.prototype.maxItems = function () {
    return this._actor ? this._actor.equipSlots().length - 1 : 0;
};

Window_EquipSlot.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.changeTextColor('#462a39');
        this.contents.fontSize = 20;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};

Window_EquipSlot.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_EquipSlot.prototype.numVisibleRows = function () {
    return 7;
};

Window_EquipSlot.prototype.drawBackgroundRect = function (rect) {
};

Window_EquipSlot.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 80;
        const dy = rect.y - 2;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

/*Window_EquipItem*/
Window_EquipItem.prototype.initialize = function (rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._actor = null;
    this._slotId = 0;
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/equip/', '底框');
    this.createCursorSprite();
};

Window_EquipItem.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/equip/', 'cursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_EquipItem.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        // this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 1;
        this._cursorSprites.y = this._cursorSprite.y + 18;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_EquipItem.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this._loadingPictrue = false;
        //this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_EquipItem.prototype.setSlotId = function (slotId) {
    if (this._slotId !== slotId) {
        this._slotId = slotId;
        this._loadingPictrue = false;
        // this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_EquipItem.prototype.updateLoading = function () {
    if (this._loadBitmap && !this._loadBitmap.isReady()) {
        return false;
    }
    return true;
}

Window_EquipItem.prototype.update = function () {
    Window_StatusBase.prototype.update.call(this);
    if (!this._loadingPictrue && this.updateLoading()) {
        this.refresh();
        this._loadingPictrue = true;
    }
    //  if (this.active && this._miniInfoWindow) this._miniInfoWindow.hide();
};

Window_EquipItem.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_EquipItem.prototype.numVisibleRows = function () {
    return 7;
};

Window_EquipItem.prototype.lineHeight = function () {
    return 27;
};

Window_EquipItem.prototype.drawBackgroundRect = function (rect) {
};

Window_EquipItem.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 2;
        const dy = rect.y - 9;
        const sx = 0;
        const sy = 0;
        const scw = 286;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw);
    };
};

Window_EquipItem.prototype.drawItem = function (index) {
    const item = this.itemAt(index);
    if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.changeTextColor('#462a39');
        this.contents.fontSize = 20;
        this.drawCursorBitmap(rect)
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x + 26, rect.y + 4, rect.width);
        this.drawItemNumber(item, rect.x - 4, rect.y + 4, rect.width);
        this.changePaintOpacity(1);
    } else {
        const rect = this.itemLineRect(index);
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.changeTextColor('#462a39');
        this.contents.fontSize = 22;
        this.drawCursorBitmap(rect);
        this.drawText('【卸下该装备】', rect.x, rect.y + 4, rect.width, 'center');
    }
};

Window_EquipItem.prototype.drawItemNumber = function (item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText("持有：", x + 10, y, width - this.textWidth("00"), "right");
        this.drawText($gameParty.numItems(item), x, y, width, "right");
    }
};

Window_EquipItem.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.changeTextColor('#462a39');
        this.contents.fontSize = 20;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};

/*Window_EquipStatus*/
Window_EquipStatus.prototype.initialize = function (rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
    this._tempActor = null;
    this.opacity = 0;
    this.refresh();
};

Window_EquipStatus.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
        this.drawAllParams();
    }
};

Window_EquipStatus.prototype.drawAllParams = function () {
    for (let i = 0; i < 4; i++) {
        const x = 116;
        const y = 54 + i * 36;
        this.drawItem(x, y, i, 0);
    };
    for (let i = 0; i < 6; i++) {
        const x = 116;
        const y = 198 + i * 36;
        this.drawItem(x, y, 2 + i, 1);
    };
};

Window_EquipStatus.prototype.drawItem = function (x, y, paramId, type) {
    const paramWidth = this.paramWidth();
    const rightArrowWidth = this.rightArrowWidth();
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
    this.contents.fontSize = 20;
    if (this._actor) {
        this.drawCurrentParam(x, y, paramId, type);
    }
    if (this._tempActor) {
        this.drawNewParam(x + paramWidth + rightArrowWidth + 16, y, paramId, type);
    }
};

Window_EquipStatus.prototype.drawCurrentParam = function (x, y, paramId, type) {
    const paramWidth = this.paramWidth();
    if (type == 0) {
        this.contents.fontSize = 22;
        var text = ['生命：', '灵力：', '怒气：', '经验：']
        this.drawText(text[paramId], 0, y, this.width, "left");
        this.contents.fontSize = 20;
        if (paramId < 2) {
            this.drawText(this._actor.param(paramId), x, y, paramWidth, "center");
        } else {
            if (paramId == 2) var value = this._actor.tp;
            if (paramId == 3) var value = this._actor.currentExp() - this._actor.currentLevelExp();
            this.drawText(value, x, y, paramWidth, "center");
        }
    } else {
        var text = ['攻击：', '防御：', '术攻：', '术防：', '身法：', '悟性：']
        this.contents.fontSize = 22;
        this.drawText(text[paramId - 2], 0, y, this.width, "left");
        this.contents.fontSize = 20;
        this.drawText(this._actor.param(paramId), x, y, paramWidth, "center");
    }
    this.drawText('→', x + 50, y, paramWidth, "center");
};

Window_EquipStatus.prototype.drawNewParam = function (x, y, paramId, type) {
    const paramWidth = this.paramWidth();
    if (type == 0) {
        if (paramId < 2) {
            const newValue = this._tempActor.param(paramId);
            const diffvalue = newValue - this._actor.param(paramId);
            this.changeTextColor(ColorManager.newParamchangeTextColor(diffvalue));
            this.drawText(newValue, x, y, paramWidth, "center");
        } else {
            if (paramId == 2) {
                var value = this._tempActor.tp;
                var diffvalues = value - this._actor.tp;
            }
            if (paramId == 3) {
                var value = this._tempActor.currentExp() - this._tempActor.currentLevelExp();
                var diffvalues = value - (this._actor.currentExp() - this._actor.currentLevelExp());

            }
            this.changeTextColor(ColorManager.newParamchangeTextColor(diffvalues));
            this.drawText(value, x, y, paramWidth, "center");
        }
    } else {
        const newValue = this._tempActor.param(paramId);
        const diffvalue = newValue - this._actor.param(paramId);
        this.changeTextColor(ColorManager.newParamchangeTextColor(diffvalue));
        this.drawText(newValue, x, y, paramWidth, "center");
    }
};

Window_EquipStatus.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineWidth = 3;
    } else {
        this.contents.outlineWidth = 1;
    }
};

ColorManager.newParamchangeTextColor = function (change) {
    if (change > 0) {
        return '#de4b2e';
    } else if (change < 0) {
        return '#22b937';
    } else {
        return '#462a39';
    }
};

/*Window_Options*/
Window_Options.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/options/', '选择框');
    this.createCursorSprite();
};

Window_Options.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/options/', 'cursor');;
    this._cursorSprites.scale.set(0.8);
    this._clientArea.addChild(this._cursorSprites);
};

Window_Options.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 6;
        this._cursorSprites.y = this._cursorSprite.y + 24;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_Options.prototype.drawItem = function (index) {
    const title = this.commandName(index);
    const status = this.statusText(index);
    const rect = this.itemLineRect(index);
    const statusWidth = this.statusWidth();
    const titleWidth = rect.width - statusWidth;
    this.resetTextColor();
    this.drawCursorBitmap(rect);
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 24;

    if (title != '离开游戏' && title != '返回') {
        this.drawText(title, rect.x + 36, rect.y + 6, titleWidth, "left");
        this.drawText(status, rect.x - 6, rect.y + 6, 370, "right");
    } else {
        this.drawText(title, rect.x, rect.y + 6, 360, "center");
    }
};

Window_Options.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

Window_Options.prototype.drawBackgroundRect = function (rect) {
};

Window_Options.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this.select(0);
        this.activate();
        this._loadingPictrue = true;
    }
};

Window_Options.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_Options.prototype.numVisibleRows = function () {
    return 5;
};

Window_Options.prototype.maxCols = function () {
    return 2;
};

Cat.NewWindow.Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
Window_Options.prototype.makeCommandList = function () {
    Cat.NewWindow.Window_Options_makeCommandList.call(this);
    this.addCommand('离开游戏', "exit");
    //this.addCommand('返回', "cancel");
};

// Window_Options.prototype.addGeneralOptions = function () {
//     this.addCommand(TextManager.alwaysDash, "alwaysDash");
//     //   this.addCommand(TextManager.commandRemember, "commandRemember");
//     this.addCommand(TextManager.touchUI, "touchUI");
// };

Window_Options.prototype.addCommand = function (
    name, symbol, enabled = true, ext = null
) {
    if (symbol != "touchUI") {
        this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
    }
};

Window_Options.prototype.cursorRight = function () {
    Window_Selectable.prototype.cursorRight.call(this)
    // const index = this.index();
    // const symbol = this.commandSymbol(index);
    // if (this.isVolumeSymbol(symbol)) {
    //     this.changeVolume(symbol, true, false);
    // } else {
    //     this.changeValue(symbol, true);
    // }
};

Window_Options.prototype.cursorLeft = function () {
    Window_Selectable.prototype.cursorLeft.call(this)
    // const index = this.index();
    // const symbol = this.commandSymbol(index);
    // if (this.isVolumeSymbol(symbol)) {
    //     this.changeVolume(symbol, false, false);
    // } else {
    //     this.changeValue(symbol, false);
    // }
};

Window_Options.prototype.processOk = function () {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (symbol == 'exit') {
        SceneManager.exit();
    } else if (symbol == 'cancel') {
        SceneManager._scene.cancelSceneOptions();
    } else {
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, true, true);
        } else {
            this.changeValue(symbol, !this.getConfigValue(symbol));
        }
    }
};

/*Window_NpcTypeListCommand*/
Window_NpcTypeListCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._list = [];
    this.opacity = 0;
    this.createCursorSprite();
    this.refresh();
};

Window_NpcTypeListCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/cy/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_NpcTypeListCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y - 2;
    if (this.index() >= 0) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 10;
        this._cursorSprites.y = this._cursorSprite.y + 10;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_NpcTypeListCommand.prototype.drawBackgroundRect = function (rect) {
};

Window_NpcTypeListCommand.prototype.drawItem = function (index) {
    this.contents.fontSize = 20;
    const rect = this.itemLineRect(index);
    const type = this._list[index];
    if (type) {
        this.resetTextColor();
        this.contents.fontSize = 24;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(type, rect.x, rect.y, this.itemWidth() - this.contents.fontSize - 3, 'center');
    };
};

/*Window_LetterNpcActionCommand*/
Window_LetterNpcActionCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this._list = [];
    this.opacity = 255;
    //  this.refresh();
};

/*Window_LetterNpcCommand*/
Window_LetterNpcCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._list = [];
    this.opacity = 0;
    this.createCursorSprite();
    this.refresh();
};

Window_LetterNpcCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/cy/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_LetterNpcCommand.prototype.drawBackgroundRect = function (rect) {
};

Window_LetterNpcCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        var x = 0;
        if (this.index() >= 1) {
            var x = 10;
        }
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 6 + x;
        this._cursorSprites.y = this._cursorSprite.y + 16;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_LetterNpcCommand.prototype.drawItem = function (index) {
    this.contents.fontSize = 26;
    const rect = this.itemLineRect(index);
    const type = this._list[index];
    if (type) {
        this.resetTextColor();
        this.contents.fontSize = 26;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(type, rect.x, rect.y, this.itemWidth() - this.contents.fontSize, 'center');
    };
};

/*Window_LetterNpcList*/
Window_LetterNpcList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.createCursorSprite();
};

Window_LetterNpcList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/cy/', 'cursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_LetterNpcList.prototype.drawBackgroundRect = function (rect) {
    const c1 = ColorManager.itemBackColor1();
    const c2 = ColorManager.itemBackColor2();
    const x = rect.x;
    const y = rect.y;
    const w = rect.width;
    const h = rect.height;
    //   this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
    this.contentsBack.strokeRect(x, y, w, h, '#462a39');
};

Window_LetterNpcList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_LetterNpcList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const npc = this._list[index];
    if (npc) {
        this.drawText(npc.name, rect.x, rect.y + 4, rect.width, 'center')
    }
}

Window_LetterNpcList.prototype.refresh = function (npcIndex) {
    this._npcIndex = npcIndex;
    this.contents.clear();
    this.contentsBack.clear();
    this.contents.fontSize = 24;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this._list = [];
    for (let i = 0; i < $gameSystem._LetterNpcData.length; i++) {
        if ($gameSystem._LetterNpcData[i] && $gameSystem._LetterNpcData[i].type == this._npcIndex)
            this._list.push($gameSystem._LetterNpcData[i]);
    }
    if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
    } else {
        this.contents.fontSize = 20;
        this.drawText('无联系人', -10, this.height / 2 - 40, this.width, 'center')
        this.select(-1);
    }
};

/*Window_NpcInfo*/
Window_NpcInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_NpcInfo.prototype.refresh = function (people) {
    this.contents.clear();
    this.contentsBack.clear();
    this.contents.fontSize = 20;
    const loveValue = people.loveValue || 0;
    const note = people.note || '';
    const name = people.name;
    if (loveValue == 0) {
        var c = '\\C[0]'
    } else if (loveValue > 0 && loveValue <= 30) {
        var c = '\\C[3]'
    } else if (loveValue > 30 && loveValue <= 60) {
        var c = '\\C[14]'
    } else if (loveValue > 60) {
        var c = '\\C[10]'
    } else if (loveValue < 0 && loveValue >= -60) {
        var c = '\\C[11]'
    } else if (loveValue < -60) {
        var c = '\\C[27]'
    }
    this.drawTextEx('\\C[0]姓名：\\C[14]' + name + '  \\C[0]好友度：' + c + loveValue, 0, -1, this.width)
};

Window_NpcInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 22;
    this.resetTextColor();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
};

Window_NpcInfo.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineWidth = 3;
    } else {
        this.contents.outlineWidth = 1;
    }
};

/*Window_LetterNpcInfo*/
Window_LetterNpcInfo.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.windowskin = ImageManager.loadSystem("Window20");
};

Window_LetterNpcInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 18;
    this.resetTextColor();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
};

Window_LetterNpcInfo.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineWidth = 3;
    } else {
        this.contents.outlineWidth = 1;
    }
};

Window_LetterNpcInfo.prototype.numVisibleRows = function () {
    return 6;
};

Window_LetterNpcInfo.prototype.convertEscapeCharacters = function (text) {
    /* eslint no-control-regex: 0 */
    const regex = /[\r\n]/g;
    let match;
    const newLineIndices = [];

    while ((match = regex.exec(text))) {
        newLineIndices.push(match.index);
    }
    var textWidth = 0;
    var newText = [];
    for (let i = 0; i < text.length; i++) {
        var value = this.textWidth(text[i]);
        newText.push(text[i]);
        if (newLineIndices.includes(i)) {
            textWidth = 0;
        }
        textWidth += value;
        if (textWidth >= this.width + 15) {
            newText.push('\n');
            textWidth = 0;
        };
    };
    text = newText.join('')
    text = text.replace(/\\/g, "\x1b");
    text = text.replace(/\x1b\x1b/g, "\\");
    text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
        $gameVariables.value(parseInt(p1))
    );
    text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
        $gameVariables.value(parseInt(p1))
    );
    text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
        this.actorName(parseInt(p1))
    );
    text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
        this.partyMemberName(parseInt(p1))
    );
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    text = text.replace(/\x1bCT\[(\d+)\]/gi, function () {
        $gameMessage.setAlign(Number(arguments[1] || 0));
        return "";
    }.bind(this));
    return text;
};

Game_System.prototype.playLetterNpcMessage = function (message, item, type, img, max, scaleX, scaleY) {
    var htime = new Date();
    var hour = htime.getHours();   //时
    var min = htime.getMinutes();  //分
    var ss = htime.getSeconds();   //秒
    SoundManager.playLetterSe('Bell3');//播放音效
    var text = '';
    if (ss < 10) var text = '0';
    var time = ''//hour + ':' + min + ':' + text + ss;
    if (type == 1) {
        item.letterText.push('\\C[0]' + time + ' ' + item.name + ':  ' + message);
        SceneManager._scene._infoWindow.refresh(item);
    } else if (type == -1) {
        item.letterText.push('\\C[0]' + time + ' ' + item.name + ':  \\C[14]' + message);
        if (img) {
            if (max) {
                var maxText = ' ' + max;
            } else {
                var maxText = ' ' + 3;
            }
            if (!scaleX) {
                var scaleX = ' ' + 1;
            } else {
                var scaleX = ' ' + scaleX;
            }
            if (!scaleY) {
                var scaleY = ' ' + 1;
            } else {
                var scaleY = ' ' + scaleY;
            }
            item.letterText.push('img ' + img + maxText + scaleX + scaleY);
        }
    }
    else {
        item.letterText.push('\\C[0]' + time + '\\C[3]' + '  ' + message);
        item.letterText.push('\\C[0]' + time + ' ' + item.name + ':  ' + $gameSystem.LetterNpcHd(message, item));
        SceneManager._scene._infoWindow.refresh(item);
    }
};

/*Window_PetList*/
Window_PetList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = false;
    this.windowskin = ImageManager.loadSystem("Window20");
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/lc/', '条框');
    this.createCursorSprite();
};

Window_PetList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/lc/', 'cursor');
    this._cursorSprites.scale.set(0.7);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_PetList.prototype.updateLoading = function () {
    if (this._loadBitmap && !this._loadBitmap.isReady()) {
        return false;
    }
    return true;
}

Window_PetList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y + 24;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_PetList.prototype.refresh = function () {
    this.contents.clear();
    this._list = [];
    this._list = $gameSystem._petActorList ? $gameSystem._petActorList : [];
    if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
    } else {
        this.contents.fontSize = 20;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        //  this.drawText('未获得宠物', -10, this.height / 2 - 30, this.width, 'center')
    }
};

Window_PetList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const pet = this._list[index];
    if (pet) {
        this.contents.fontSize = 18;
        this.drawCursorBitmap(rect)
        const colorId = pet.meta.颜色 ? pet.meta.颜色 : 0;
        if (colorId == 0) {
            this.changeTextColor('#462a39');
            this.contents.outlineColor = '#462a39';
            this.contents.outlineWidth = 1;
        } else {
            this.changeTextColor(ColorManager.textColor(Number(colorId)));
            this.contents.outlineColor = '#462a39';
            //this.contents.outlineColor = ColorManager.textColor(Number(colorId));
            this.contents.outlineWidth = 3;
        }
        this.drawText(pet.name, rect.x + 3, rect.y - 10, this.width, 'left')
        const pets = $gameActors.actor(pet.id)
        const petIndex = $gameParty.allMembers().indexOf(pets);
        if (petIndex != -1) {
            var note = '[已参战]';
            this.changeTextColor('#0dfb48');
            // this.contents.outlineColor = '#0dfb48';
            // this.contents.outlineWidth = 1;
        }
        else {
            this.changeTextColor('#1f9dec');
            this.contents.outlineColor = '#1f9dec';
            this.contents.outlineWidth = 1;
            var note = '[休息]';
        }
        this.contents.fontSize = 16;
        this.drawText(note, rect.x - 2, rect.y + 8, this.itemWidth() - 30, 'right')
        this.resetTextColor();
    }
}

Window_PetList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y - 6;
        const sx = 0;
        const sy = 0;
        const scw = 140;
        const sch = ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};

Window_PetList.prototype.numVisibleRows = function () {
    return 3;
};

/*Window_NewPetCommand*/
function Window_NewPetCommand() {
    this.initialize(...arguments);
}

Window_NewPetCommand.prototype = Object.create(Window_Selectable.prototype);
Window_NewPetCommand.prototype.constructor = Window_NewPetCommand;

Window_NewPetCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.createCursorSprite();
    this.refresh();
};

Window_NewPetCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        var ofx = 0;
        if (this.index() == 3) {
            var ofx = 0;
        }
        this._cursorSprites.alpha = 1//this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 2 + ofx;
        this._cursorSprites.y = this._cursorSprite.y + 6;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_NewPetCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/lc/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_NewPetCommand.prototype.refresh = function () {
    this.contents.clear();
    this._list = ['参战', '休息', '投喂', '装备'];
    this.drawAllItems();
};

Window_NewPetCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const item = this._list[index];
    if (item) {
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.changeTextColor('#462a39');
        if (index == 3) {
            const indexs = SceneManager._scene._petListWindow.index();
            const list = SceneManager._scene._petListWindow._list;
            var vx = rect.x + 48;
            if (SceneManager._scene._petListWindow && list && indexs >= 0 && list[indexs]) {
                const actor = $gameActors.actor(list[indexs].id);
                const equips = actor.equips();
                const items = equips[7];
                if (items) {
                    var text = items.name;
                    this.drawText(item + ': ' + text, vx, rect.y, rect.width, 'left')
                } else {
                    var text = '无'
                    this.drawText(item + ': ' + text, vx, rect.y, rect.width, 'left')
                }
            } else {
                var text = '无'
                this.drawText(item + ': ' + text, vx, rect.y, rect.width, 'left')
            }
        } else {
            this.drawText(item, rect.x, rect.y, rect.width, 'center')
        };
    };
};

Window_NewPetCommand.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};

Window_NewPetCommand.prototype.maxCols = function () {
    return 3;
};

Window_NewPetCommand.prototype.numVisibleRows = function () {
    return 2;
};

Window_NewPetCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_NewPetCommand.prototype.itemRect = function (index) {
    // const maxCols = this.maxCols();
    // const itemWidth = this.itemWidth();
    // const itemHeight = this.itemHeight();
    // const colSpacing = this.colSpacing();
    // const rowSpacing = this.rowSpacing();
    // const col = index % maxCols;
    // const row = Math.floor(index / maxCols);
    // const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    // const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    // const width = itemWidth - colSpacing;
    // const height = itemHeight - rowSpacing;
    if (index == 0) {
        var x = 0;
        var y = 0;
        var width = 115;
        var height = 50;
    } else if (index == 1) {
        var x = 130;
        var y = 0;
        var width = 115;
        var height = 50;
    } else if (index == 2) {
        var x = 260;
        var y = 0;
        var width = 115;
        var height = 50;
    } else if (index == 3) {
        var x = 0;
        var y = 65;
        var width = 230;
        var height = 50;
    } else {
        var x = 260;
        var y = 65;
        var width = 115;
        var height = 50;
    }
    return new Rectangle(x, y, width, height);
};

Window_NewPetCommand.prototype.drawBackgroundRect = function (rect) {
};

/*Window_PetUseList*/
Window_PetUseList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this._actor = null;
    this._type = -1;
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/lc/', '列表底框');
    this.createCursorSprite();
};

Window_PetUseList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/lc/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._clientArea.addChild(this._cursorSprites);
};

Window_PetUseList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const item = this._list[index];
    if (item) {
        this.contents.fontSize = 20;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawCursorBitmap(rect)
        //  this.drawIcon(item.iconIndex, rect.x + 5, rect.y - 4)
        if (item == '【卸下该装备】') {
            this.drawText(item, rect.x, rect.y + 4, rect.width, 'center');
        } else {
            this.drawText(item.name, rect.x + 34, rect.y - 6, this.width, 'left');
            if (!DataManager.isSkill(item)) {
                this.contents.fontSize = 18;
                this.drawText("持有：", rect.x - 10, rect.y + 14, rect.width - this.textWidth("00"), "right");
                this.drawText($gameParty.numItems(item), rect.x - 10, rect.y + 14, rect.width, "right");
            }
        }
    }
};
Window_PetUseList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = 1//this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 4;
        this._cursorSprites.y = this._cursorSprite.y + 10;
    } else {
        this._cursorSprites.visible = false;
    }
    this._miniInfoWindow.x = this._cursorSprite.x + this.width + this._miniInfoWindow.width;
};

Window_PetUseList.prototype.setActor = function (actor, type) {
    this._actor = actor;
    this._type = type;
    this._loadingPictrue = false;
    // SceneManager._scene._cancelButtonSprite.show();
    SceneManager._scene._equipItemSprite.show();
    //   SceneManager._scene._equipItemBackSprite.show();
    this.activate();
};

Window_PetUseList.prototype.refresh = function () {
    this.contents.clear();
    this._list = [];
    if (this._type == 0) {
        this._list = $gameParty.allItems().filter(item => item.meta.宠物使用);
    } else if (this._type == 1) {
        this._list = $gameParty.allItems().filter(item => item.atypeId == 7 && item.etypeId == 8);
        this._list.push('【卸下该装备】')
    } else {
        const actor = $gameActors.actor(this._actor.id)
        const skills = actor._skills;
        for (let i = 0; i < skills.length; i++) {
            const skill = $dataSkills[Number(skills[i])];
            if (skill) {
                this._list.push(skill);
            };
        }
    }
    if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
    } else {
        this.contents.fontSize = 24;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        if (this._type == 0) {
            this.drawText('没有可使用道具', -10, this.height / 2 - 30, this.width, 'center');
        }
        if (this._type == 1) {
            this.drawText('没有可装备驭灵环', -10, this.height / 2 - 30, this.width, 'center');
        }
        if (this._type == 2) {
            this.drawText('没有可装备技能', -10, this.height / 2 - 30, this.width, 'center');
        }
    };
};

/*Window_PetParam*/
function Window_PetParam() {
    this.initialize(...arguments);
}

Window_PetParam.prototype = Object.create(Window_Base.prototype);
Window_PetParam.prototype.constructor = Window_PetParam;

Window_PetParam.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_PetParam.prototype.refresh = function (pet) {
    this.contents.clear();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 24;
    const actor = pet;
    var x = 0;
    var y = 0;
    var text = ['生命：', '等级：', '经验：', '', '攻击：', '防御：', '术攻：', '术防：', '身法：', '悟性：'];
    for (let i = 0; i < 4; i++) {
        if (i % 2 == 1) {
            var x = 200;
        } else {
            var x = 0;
        }
        if (i < 2) {
            if (i == 0) {
                this.drawText(text[i] + actor.hp + '/' + actor.mhp, x, y, this.width, "left");
            } else {
                this.drawText(text[i] + actor._level, x, y, this.width, "left");
            }
        } else {
            if (i == 2) {
                //var value = actor.tp;
                const nowExp = actor.currentExp() - actor.currentLevelExp();
                const maxExp = actor.nextLevelExp() - actor.currentLevelExp();
                var value = nowExp + '/' + maxExp
            }
            if (i == 3) {
                var value = ''//actor.currentExp() - actor.currentLevelExp();
            }
            this.drawText(text[i] + value, x, y, this.width, "left");
        }
        if (i % 2 == 1) {
            y += 40;
        }
    };

    for (let i = 0; i < 6; i++) {
        if (i % 2 == 1) {
            var x = 200;
        } else {
            var x = 0;
        }
        this.drawText(text[i + 4] + actor.param(i + 2), x, y, this.width, "left");
        if (i % 2 == 1) {
            y += 40;
        }
    }
};

/*Window_PetParam*/
function Window_PetSkill() {
    this.initialize(...arguments);
}

Window_PetSkill.prototype = Object.create(Window_Base.prototype);
Window_PetSkill.prototype.constructor = Window_PetSkill;

Window_PetSkill.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_PetSkill.prototype.refresh = function (pet) {
    this.contents.clear();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 24;
    const actor = pet;
    var x = 0;
    var y = 0;
    this.drawText('技能栏', x, y, this.width - 30, "center");
    this.contents.fontSize = 20;
    y += 34;
    for (let i = 1; i < actor.skills().length; i++) {
        if (i % 2 == 0) {
            var x = 200;
        } else {
            var x = 0;
        }
        this.drawText(actor.skills()[i].name, x, y, this.width, "left");
        if (i % 2 == 0) {
            y += 32;
        }
    };
};

/*Window_PartyCommand*/
// Window_PartyCommand.prototype.itemRect = function (index) {
//     if (index == 0) {
//         var x = 0;
//         var y = 0;
//         var width = 304;
//         var height = 49
//     } else if (index == 1) {
//         var x = 0;
//         var y = 50;
//         var width = 182;
//         var height = 48;
//     } else {
//         var x = 182;
//         var y = 50;
//         var width = 122;
//         var height = 48;
//     }
//     return new Rectangle(x, y, width, height);
// };

Cat.NewWindow.Window_PartyCommand_initialize = Window_PartyCommand.prototype.initialize;
Window_PartyCommand.prototype.initialize = function (rect) {
    Cat.NewWindow.Window_PartyCommand_initialize.call(this, rect);
    this.opacity = 0;
    this.createCursorSprite();
};

Window_PartyCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/battle/', 'cursor');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_PartyCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = 1//this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        if (this.index() == 0) {
            var ofx = 56;
            var ofy = 150;
        } else {
            var ofx = 4;
            var ofy = 110;
        };
        this._cursorSprites.x = this._cursorSprite.x + ofx;
        this._cursorSprites.y = this._cursorSprite.y + ofy;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_PartyCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor(); 1
    this.changePaintOpacity(this.isCommandEnabled(index));
    // this.changeTextColor('#462a39');
    // this.contents.outlineColor = '#462a39';
    // this.contents.outlineWidth = 1;
    this.changeTextColor(ColorManager.textColor(0))
    this.contents.fontSize = 28;

    if (index == 0) {
        this.drawText('战', rect.x + 25, rect.y - 5, rect.width, align);
        this.drawText('斗', rect.x + 25, rect.y + 25, rect.width, align);
    } else {
        this.drawText('逃', rect.x - 25, rect.y - 40, rect.width, align);
        this.drawText('跑', rect.x - 25, rect.y - 10, rect.width, align);
    }
};

Window_PartyCommand.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};

Window_PartyCommand.prototype.maxCols = function () {
    return 2;
};

Window_PartyCommand.prototype.numVisibleRows = function () {
    return 1;
};

Window_PartyCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_PartyCommand.prototype.drawBackgroundRect = function (rect) {
};

/*Window_ActorCommand*/
Cat.NewWindow.Window_ActorCommand_initialize = Window_ActorCommand.prototype.initialize;
Window_ActorCommand.prototype.initialize = function (rect) {
    Cat.NewWindow.Window_ActorCommand_initialize.call(this, rect);
    this.opacity = 0;
    this.createCursorSprite();
};

Window_ActorCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/battle/', '光标');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_ActorCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = 1//this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 40;
        this._cursorSprites.y = this._cursorSprite.y - 8;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_ActorCommand.prototype.numVisibleRows = function () {
    return 5;
};

Window_ActorCommand.prototype.maxCols = function () {
    return 1;
};

Window_ActorCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_ActorCommand.prototype.drawBackgroundRect = function (rect) {
};

Window_ActorCommand.prototype.cursorDown = function (wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
        this.smoothSelect((index + maxCols) % maxItems);
    }
};

Window_ActorCommand.prototype.cursorUp = function (wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    if (index >= maxCols || (wrap && maxCols === 1)) {
        this.smoothSelect((index - maxCols + maxItems) % maxItems);
    }
};

Window_ActorCommand.prototype.cursorRight = function (wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    const horizontal = this.isHorizontal();
    if (maxCols >= 2 && (index < maxItems - 1 || (wrap && horizontal))) {
        this.smoothSelect((index + 1) % maxItems);
    }
};

Window_ActorCommand.prototype.cursorLeft = function (wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    const horizontal = this.isHorizontal();
    if (maxCols >= 2 && (index > 0 || (wrap && horizontal))) {
        this.smoothSelect((index - 1 + maxItems) % maxItems);
    }
};

Window_ActorCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor(); 1
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 22;
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

/*Window_BattleSkill*/
Window_BattleSkill.prototype.initialize = function (rect) {
    Window_SkillList.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.hide();
};

Window_BattleSkill.prototype.drawItem = function (index) {
    const skill = this.itemAt(index);
    if (skill) {
        const costWidth = this.costWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(skill));
        this.changeTextColor('#462a39');
        //  this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawItemName(skill, rect.x + 4, rect.y, rect.width - costWidth);
        this.drawSkillCost(skill, rect.x - 2, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_BattleSkill.prototype.update = function () {
    Window_SkillList.prototype.update.call(this);
};

Window_BattleSkill.prototype.drawBackgroundRect = function (rect) {
};

Window_BattleSkill.prototype._updateCursor = function () {
    this._cursorSprite.alpha = this._makeCursorAlpha();;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};

/*Window_BattleHelp*/
Window_BattleHelp.prototype.initialize = function (rect) {
    Window_Help.prototype.initialize.call(this, rect);
    this.opacity = 255;
    this.windowskin = ImageManager.loadSystem("Window20");
};

// Window_BattleHelp.prototype.resetFontSettings = function () {
//     this.contents.fontFace = $gameSystem.mainFontFace();
//     this.contents.fontSize = 24;
//     this.resetTextColor();
//     //this.changeTextColor('#462a39');
//     // this.contents.outlineColor = '#462a39';
//    // this.contents.outlineWidth = 1;
// };

// Window_BattleHelp.prototype.processColorChange = function (colorIndex) {
//     if (colorIndex == 0 && $gameMessage.background() == 0) {
//         this.changeTextColor('#462a39');
//         // this.contents.outlineColor = '#462a39';
//         this.contents.outlineWidth = 1;
//     } else if (colorIndex == 6 && $gameMessage.background() == 0) {
//         this.changeTextColor('#edbd28');
//         // this.contents.outlineColor = '#f6d160';
//         // this.contents.outlineWidth = 1;
//         this.contents.outlineWidth = 3;
//     } else {
//         if ($gameMessage.background() == 0) {
//             this.changeTextColor(ColorManager.textColor(colorIndex));
//             // this.changeOutlineColor(ColorManager.textColor(colorIndex));
//             this.contents.outlineWidth = 3;
//         } else {
//             this.changeTextColor(ColorManager.textColor(colorIndex));
//             //  this.changeOutlineColor(ColorManager.outlineColor());
//             this.contents.outlineWidth = 3;
//         }
//     }
// };

/*Window_BattleItem*/
Window_BattleItem.prototype.initialize = function (rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.hide();
};

Window_BattleItem.prototype.drawItem = function (index) {
    const item = this.itemAt(index);
    if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(item));
        this.changeTextColor('#462a39');
        this.contents.outlineWidth = 1;
        this.drawItemName(item, rect.x + 4, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x - 2, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_BattleItem.prototype.update = function () {
    Window_ItemList.prototype.update.call(this);
};

Window_BattleItem.prototype.drawBackgroundRect = function (rect) {
};

Window_BattleItem.prototype._updateCursor = function () {
    this._cursorSprite.alpha = this._makeCursorAlpha();;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};

Window_BattleItem.prototype.drawItemNumber = function (item, x, y, width) {
    if (this.needsNumber()) {
        // this.changeTextColor('#462a39');
        // this.contents.outlineWidth = 1;
        this.drawText(":", x, y, width - this.textWidth("00"), "right");
        this.drawText($gameParty.numItems(item), x, y, width, "right");
    }
};

/*Window_VictoryActor*/
Window_VictoryActor.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._upLevel = false;
    this._upActorLast = null;
};

Window_VictoryActor.prototype.refresh = function () {
    if (this.contents) {
        this.createContents();
        this.contents.fontSize = 28;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText('战斗结算', 0, 4, this.width - this.contents.fontSize, 'center');
        this.contents.fontSize = 20;
        const actor = $gameParty.allMembers()[0];
        const level = actor._level;
        const hp = actor.mhp;
        const mp = actor.mmp;
        const atk = actor.atk;
        const mat = actor.mat;
        const def = actor.def;
        const mdf = actor.mdf;
        const agi = actor.agi;
        const luk = actor.luk;
        const upLevel = this._upLevel;
        const lastActor = this._upActorLast;
        var text = '';
        var y = 60;
        var x = 0;
        if (upLevel && lastActor) {
            var text = Cat.VictoryUi.text_3;
            var ofy = 24;
            this.drawTextEx("等级: " + level + '（\\C[10]↑' + Math.floor(level - lastActor.level) + '\\C[0]）' + '\\C[10]' + text, x, y, this.width, 'left');
            this.changeTextColor('#462a39');
            this.contents.outlineColor = '#462a39';
            this.contents.outlineWidth = 1;
            y += ofy;
            this.drawTextEx(TextManager.hp + ": " + hp + '（\\C[10]↑' + Math.floor(hp - lastActor.mhp) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.mp + ": " + mp + '（\\C[10]↑' + Math.floor(mp - lastActor.mmp) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(2) + ": " + atk + '（\\C[10]↑' + Math.floor(atk - lastActor.atk) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(3) + ": " + def + '（\\C[10]↑' + Math.floor(def - lastActor.def) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(4) + ": " + mat + '（\\C[10]↑' + Math.floor(mat - lastActor.mat) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(5) + ": " + mdf + '（\\C[10]↑' + Math.floor(mdf - lastActor.mdf) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(6) + ": " + agi + '（\\C[10]↑' + Math.floor(agi - lastActor.agi) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(7) + ": " + luk + '（\\C[10]↑' + Math.floor(luk - lastActor.luk) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
        } else {
            var text = '';
            var ofy = 24;
            this.drawTextEx("等级: " + level + '\\C[10]' + text, x, y, this.width, 'left');
            this.changeTextColor('#462a39');
            this.contents.outlineColor = '#462a39';
            this.contents.outlineWidth = 1;
            y += ofy;
            this.drawText(TextManager.hp + ": " + hp, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.mp + ": " + mp, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(2) + ": " + atk, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(3) + ": " + def, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(4) + ": " + mat, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(5) + ": " + mdf, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(6) + ": " + agi, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(7) + ": " + luk, x, y, this.width, 'left');
            y += ofy;
        }
    }
};

Window_VictoryActor.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 10) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineColor = this.contents.textColor;
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
    }
};

Window_VictoryActor.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 20;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
};

/*Window_VictorySatus*/
Window_VictorySatus.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._gold = null;
    this._exp = null;
    this.opacity = 0;
};


Window_VictorySatus.prototype.drawInfo = function () {
    if (this.contents) {
        this.createContents();
        const gold = this._gold;
        const exp = this._exp;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 20;
        this.drawText(Cat.VictoryUi.text_0 + gold, 0, 0, this.width, 'left');
        this.drawText(Cat.VictoryUi.text_1 + exp, 0, 28, this.width, 'left');
        this.drawText(Cat.VictoryUi.text_2, 0, 56, this.width, 'left');
    };
};

/*Window_VictoryItem*/
Window_VictoryItem.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_VictoryItem.prototype.drawItem = function (index) {
    const rect = this.itemRect(index);
    const name = this._list[index].name;
    const iconIndex = this._list[index].iconIndex;
    this.contents.fontSize = 20;
    this.drawIcon(iconIndex, rect.x, rect.y + 3, 36, 36)
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(name, rect.x + 36, rect.y + 2, this.itemWidth(), 'left')
    this.resetTextColor();
};

Window_VictoryItem.prototype.numVisibleRows = function () {
    return 3;
};

Window_VictoryItem.prototype.maxCols = function () {
    return 2;
};

Cat.NewWindow.Window_ChoiceList_initialize = Window_ChoiceList.prototype.initialize;
Window_ChoiceList.prototype.initialize = function () {
    Cat.NewWindow.Window_ChoiceList_initialize.call(this, new Rectangle());
    this.windowskin = ImageManager.loadSystem("Window20");
    //  this.createCursorSprite();
};

Window_ChoiceList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/options/', '光标');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_ChoiceList.prototype.drawBackgroundRect = function (rect) {
};

// Window_ChoiceList.prototype._updateCursor = function () {
//     this._cursorSprite.alpha = 0;
//     this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
//     this._cursorSprite.x = this._cursorRect.x;
//     this._cursorSprite.y = this._cursorRect.y;
//     if (this.index() >= 0) {
//         this._cursorSprites.alpha = 1//this._makeCursorAlpha();
//         this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
//         this._cursorSprites.x = this._cursorSprite.x;
//         this._cursorSprites.y = this._cursorSprite.y - 4;
//     } else {
//         this._cursorSprites.visible = false;
//     }
// };

// Window_ChoiceList.prototype.updatePlacement = function () {
//     this.x = this.windowX() - 48;
//     this.y = this.windowY();
//     this.width = this.windowWidth() + 48;
//     this.height = this.windowHeight();
// };

// Window_ChoiceList.prototype.drawItem = function (index) {
//     const rect = this.itemLineRect(index);
//     this.drawTextEx(this.commandName(index), rect.x + 48, rect.y, rect.width);
// };

Window_ChoiceList.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = $gameSystem.mainFontSize();
    this.resetTextColor();
    // this.changeTextColor('#462a39');
    // this.contents.outlineColor = '#462a39';
    // this.contents.outlineWidth = 1;
};

Window_ChoiceList.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        if (colorIndex == 0) {
            // this.changeTextColor('#462a39');
            // this.contents.outlineColor = '#462a39';
            // this.contents.outlineWidth = 1;
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.contents.outlineWidth = 3;
        } else {
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.contents.outlineWidth = 3;
        }
    } else {
        this.contents.outlineWidth = 1;
    }
};

// Window_ChoiceList.prototype.updateBackOpacity = function () {
//     this.backOpacity = 255;
// };

Cat.NewWindow.Window_Message_initialize = Window_Message.prototype.initialize;
Window_Message.prototype.initialize = function (rect) {
    Cat.NewWindow.Window_Message_initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
};

// Window_Message.prototype.updateBackOpacity = function () {
//     this.backOpacity = 255;
// };

Window_Message.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = $gameSystem.mainFontSize();
    this.resetTextColor();
    // this.changeTextColor('#462a39');
    // this.contents.outlineColor = '#462a39';
    // this.contents.outlineWidth = 1;
};

Window_Message.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        if (colorIndex == 0) {
            // this.changeTextColor('#462a39');
            // this.contents.outlineColor = '#462a39';
            // this.contents.outlineWidth = 1;
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.contents.outlineWidth = 3;
        } else {
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.contents.outlineWidth = 3;
        }
    } else {
        this.contents.outlineWidth = 1;
    }
};

Cat.NewWindow.Window_NameBox_initialize = Window_NameBox.prototype.initialize;
Window_NameBox.prototype.initialize = function () {
    Cat.NewWindow.Window_NameBox_initialize.call(this, new Rectangle());
    this.windowskin = ImageManager.loadSystem("Window20");
};

// Window_NameBox.prototype.updateBackOpacity = function () {
//     this.backOpacity = 255;
// };

Window_NameBox.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = $gameSystem.mainFontSize();
    this.resetTextColor();
    // this.changeTextColor('#462a39');
    // this.contents.outlineColor = '#462a39';
    // this.contents.outlineWidth = 1;
};

Window_NameBox.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        if (colorIndex == 0) {
            // this.changeTextColor('#462a39');
            // this.contents.outlineColor = '#462a39';
            // this.contents.outlineWidth = 1;
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.contents.outlineWidth = 3;
        } else {
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.contents.outlineWidth = 3;
        }
    } else {
        this.contents.outlineWidth = 1;
    }
};

/*Window_MiniInfo*/
Window_MiniInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 20;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
};
Window_MiniInfo.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.changeTextColor(ColorManager.textColor(0));
        // this.changeTextColor('#462a39');
        //  this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 3;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};
Window_MiniInfo.prototype.processColorChange = function (colorIndex) {
    this.changeTextColor(ColorManager.textColor(colorIndex));
    this.contents.outlineWidth = 3;
    // if (colorIndex == 0) {
    //     this.changeTextColor(ColorManager.textColor(0));
    //     this.contents.outlineWidth = 3;
    //     // this.changeTextColor('#462a39');
    //     // this.contents.outlineColor = '#462a39';
    //     // this.contents.outlineWidth = 1;
    // } else if (colorIndex == 6) {
    //     this.changeTextColor('#edbd28');
    //     this.contents.outlineColor = '#462a39';
    //     this.contents.outlineWidth = 3;
    // } else {
    //     this.changeTextColor(ColorManager.textColor(colorIndex));
    //     this.contents.outlineColor = '#462a39';
    //     this.contents.outlineWidth = 3;
    //     // this.contents.outlineColor = ColorManager.textColor(colorIndex)//'#eeeee8';
    //     // this.contents.outlineWidth = 1;
    // }
};