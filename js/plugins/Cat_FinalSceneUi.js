//=============================================================================
// RPG Maker MZ - Ui终版-场景
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<Ui终版-场景>
 * @author Cat
 * @help
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_FinalSceneUi = true;

var Cat = Cat || {};
Cat.FinalSceneUi = {};
Cat.FinalSceneUi.parameters = PluginManager.parameters('Cat_FinalSceneUi');

const TouchInputData = [];
TouchInputData[0] = [
    [383, 480, 116, 184],
    [351, 511, 280, 358],
    [404, 464, 464, 500]
];
TouchInputData[1] = [
    [383, 480, 116, 184],
    [351, 511, 280, 358],
    [404, 464, 464, 500]
];
TouchInputData[2] = [
    [383, 480, 120, 200],
    [351, 511, 269, 367],
    [404, 464, 464, 500]
];
TouchInputData[3] = [
    [383, 480, 120, 200],
    [351, 511, 269, 367],
    [404, 464, 464, 500]
];
TouchInputData[4] = [
    [383, 480, 120, 200],
    [351, 511, 269, 367],
    [404, 464, 464, 500]
];

const palySe1 = { name: '5-1TM', volume: 100, pitch: 100, pan: 100 };
const palySe2 = { name: '5-1MX', volume: 100, pitch: 100, pan: 100 };
const palySe3 = { name: '5-1MB', volume: 100, pitch: 100, pan: 100 };

const palySe11 = { name: '5-2MT', volume: 100, pitch: 100, pan: 100 };
const palySe21 = { name: '5-2MX', volume: 100, pitch: 100, pan: 100 };
const palySe31 = { name: '5-2MB', volume: 100, pitch: 100, pan: 100 };

const palySe12 = { name: '5-3MT', volume: 100, pitch: 100, pan: 100 };
const palySe22 = { name: '5-3MX', volume: 100, pitch: 100, pan: 100 };
const palySe32 = { name: '5-3MB', volume: 100, pitch: 100, pan: 100 };

const palySe13 = { name: '5-4MT', volume: 100, pitch: 100, pan: 100 };
const palySe23 = { name: '5-4MX', volume: 100, pitch: 100, pan: 100 };
const palySe33 = { name: '5-4MB', volume: 100, pitch: 100, pan: 100 };

const palySe14 = { name: '5-5MT', volume: 100, pitch: 100, pan: 100 };
const palySe24 = { name: '5-5MX', volume: 100, pitch: 100, pan: 100 };
const palySe34 = { name: '5-5MB', volume: 100, pitch: 100, pan: 100 };
/*Menu*/
Scene_MenuBase.prototype.createBackground = function () {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    this.setBackgroundOpacity(192);

    if (SceneManager._scene instanceof Scene_Title) {

    } else if (SceneManager._scene instanceof Scene_Options) {
        // this._backgroundSprite.bitmap = SceneManager.backgroundOptionBitmap();
        // this._backgroundSprite.filters = [];
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/options/', 'menuBack');
        this.addChild(this._backgroundSprite_new);
    } else if (SceneManager._scene instanceof Scene_Status) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/menu/', 'menuBack');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_Item) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/item/', 'menuBack2');
        this.addChild(this._backgroundSprite_new);
    } else if (SceneManager._scene instanceof Scene_File) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/save/', 'menuBack');
        this.addChild(this._backgroundSprite_new);
    } else if (SceneManager._scene instanceof Scene_Equip) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/equip/', 'menuBack');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_Quest) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/quest/', 'menuBack');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_Skill) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/skill/', 'menuBack');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_LetterNpc) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/cy/', 'menuBack');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_LL_Pet) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/lc/', 'menuBack');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_GameEnd) {
        this._backgroundSprite.bitmap = SceneManager.backgroundOptionBitmap();
        this._backgroundSprite.filters = []; Scene_Gameover
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', 'gameOverBack');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_SM) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/sm/', 'menuBack');
        this.addChild(this._backgroundSprite_new);
    }
};

Scene_MenuBase.prototype.commandWindowRect = function () {
    const ww = 160;
    const wh = 522;
    const wx = Graphics.width - ww - 40;
    const wy = 88 + 54;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_MenuBase.prototype.timesWindowRect = function () {
    const ww = 160;
    const wh = 130;
    const wx = 0;
    const wy = 204;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Status.prototype.statusWindowRect = function () {
    const ww = 430;
    const wh = 560;
    const wx = 705;
    const wy = 80;
    return new Rectangle(wx, wy, ww, wh);
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
    this.drawText(goldItemNumber, 10, 5, 190, "right");
    this.drawText($gameParty.gold(), 280, 5, 190, "right");
};

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
    y += 36;
    this.drawText("境界：", x, y, width, "left");
    this.drawText(llLevelName, x + 56, y + 2, 244, "center");
    this.contents.fontSize = 22;
    y += 38;
    this.drawText("生命：", x, y + 3, width, "left");
    this.drawHmtepBitmap(x + 80, y + 12, actor.hp, actor.mhp, 1);
    y += 28;
    this.drawText("灵力：", x, y + 3, width, "left");
    this.drawHmtepBitmap(x + 80, y + 12, actor.mp, actor.mmp, 3);
    y += 28;
    this.drawText("怒气：", x, y + 3, width, "left");
    this.drawHmtepBitmap(x + 80, y + 12, actor.tp, 100, 5);
    y += 28;
    this.drawText("经验：", x, y + 3, width, "left");
    const nowExp = actor.currentExp() - actor.currentLevelExp();
    const maxExp = actor.nextLevelExp() - actor.currentLevelExp();
    this.drawHmtepBitmap(x + 80, y + 12, nowExp, maxExp, 7);
    y += 30;
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
    this.contents.fontSize = 20;
    var x = 24;
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
    this.contents.fontSize = 20;
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
    this.contents.fontSize = 20;
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
    this.contents.fontSize = 20;
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
    if (!$gameSwitches.value(15) && $gameSystem._menuTearPeopleName) {
        var name = $gameSystem._menuTearPeopleName;
    } else {
        var name = '未破处';
    }
    this.drawText("破处者：" + name, x + 200, y, width, "left");
    y += 28;
    const reputationText = $gameSystem._menuReputationText || "无";
    const syValue = '(' + $gameVariables.value(13) + ')';
    this.drawText("声望：" + reputationText + syValue, x, y, width, "left");
    const remarkText = $gameSystem._menuRemarkText || "无";
    this.drawText("风评：" + remarkText, x + 200, y, width, "left");
    y += 36;
    this.drawText("状态&特性", x + 104, y, width, "left");
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
    if (id > 7) {
        this.drawText(now + '/' + max + text, x, y - 10 + 3, 220, 'center');
    } else {
        this.drawText(now + '/' + max + text, x, y - 10 + 3, 170, 'center');
    }
    this.contents.fontSize = 22;
};

/*Item*/
Scene_Item.prototype.categoryWindowRect = function () {
    const wx = 120;
    const wy = 106;
    const ww = 950;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.itemWindowRect = function () {
    const wx = 178 - 16;
    const wy = 186 + 10;
    const ww = 910;
    const wh = 306;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.helpWindowRect = function () {
    const wx = 170;
    const wy = 516;
    const ww = 910;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.hpMpWindowRect = function () {
    const ww = Graphics.width;
    const wh = 200;
    const wx = 270;
    const wy = 56;
    return new Rectangle(wx, wy, ww, wh);
};

Window_NewItemCategory.prototype.initialize = function (rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
    this.select(0);
    this.activate();
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/item/', 'itemBack');
    this.createCursorSprite();
};

Window_NewItemCategory.prototype.itemRect = function (index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    var ofx = 0;
    var ofy = 0;
    // if (index < 3) {
    //     var ofx = index * 32;
    //     var ofy = 0;
    // } else if (index == 3) {
    //     var ofx = 17;
    //     var ofy = 4;
    // } else {
    //     var ofx = 0;
    //     var ofy = 0;
    // }
    if (index == 0) {
        var ofx = -2;
    };
    if (index == 3) {
        var ofx = 16;
    }
    if (index == 4) {
        var ofx = 23;
    }
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX() + ofx;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY() + ofy;
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_NewItemList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._category = "none";
    this._data = [];
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/item/', 'itemBackLong');
    this.createCursorSprite();
};

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
    this.drawText(now + '/' + max + text, x, y - 10 + 2, 170, 'center');
    this.contents.fontSize = 22;
};

/*Equip*/
Scene_Equip.prototype.commandWindowRectX = function () {
    const ww = 160;
    const wh = 522;
    const wx = Graphics.width - ww - 40;
    const wy = 88 + 54;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.commandWindowRect = function () {
    const wx = 470;
    const wy = 96;
    const ww = 340;
    const wh = 130;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.statusWindowRect = function () {
    const ww = 288;
    const wh = 434;
    const wx = 798;
    const wy = 110;
    return new Rectangle(wx, wy, ww, wh);
};

Window_EquipItem.prototype.initialize = function (rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._actor = null;
    this._slotId = 0;
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/equip/', 'listBack');
    this.createCursorSprite();
};

Scene_Equip.prototype.createItemWindow = function () {
    this._equipItemSprite = new Sprite();
    this.addChild(this._equipItemSprite);
    this._equipItemSprite.hide();
    this._equipItemSprite.bitmap = ImageManager.loadBitmap('img/newUi/equip/', 'equipBack');
    this._equipItemSprite.x = this._commandWindow.x + 3;
    this._equipItemSprite.y = this._commandWindow.y + 12;

    const rect = this.itemWindowRect();
    this._itemWindow = new Window_EquipItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._itemWindow.hide();
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addChild(this._itemWindow);
};

Scene_Equip.prototype.itemWindowRect = function () {
    const wx = this._equipItemSprite.x - 8;
    const wy = this._equipItemSprite.y - 12;
    const ww = 320;
    const wh = 472;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.slotWindowRect = function () {
    const commandWindowRect = this.commandWindowRect();
    const wx = 180;
    const wy = 86;
    const ww = 320;
    const wh = 472;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.helpWindowRect = function () {
    const wx = 194;
    const wy = 538;
    const ww = 915;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

Window_NewEquipCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
    if (index == 0) {
        this.drawText(this.commandName(index), rect.x - 6, rect.y, rect.width, align);
    } else {
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    }
};

Window_EquipStatus.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.changeTextColor('#462a39');
        this.drawText('基础属性', 0, -3, 254, 'center');
        this.drawAllParams();
    }
};

/*Skill*/
Scene_Skill.prototype.hpMpWindowRect = function () {
    const ww = Graphics.width;
    const wh = 200;
    const wx = 270;
    const wy = 56;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.skillTypeWindowRect = function () {
    const wx = 194;
    const wy = 104;
    const ww = 950;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.itemWindowRect = function () {
    const wx = 170;
    const wy = 175;
    const ww = 910;
    const wh = 350;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.helpWindowRect = function () {
    const wx = 190;
    const wy = 515;
    const ww = 915;
    const wh = 96;
    return new Rectangle(wx, wy, ww, wh);
};

Window_NewSkillType.prototype.itemRect = function (index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    if (index == 1) {
        var ofx = 20;
        var ofy = 0;
    } else if (index == 2) {
        var ofx = 34;
        var ofy = 0;
    } else if (index == 3) {
        var ofx = 1;
        var ofy = 2;
    } else {
        var ofx = 0;
        var ofy = 0;
    }
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX() + ofx;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY() + ofy;
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_NewSkillList.prototype.initialize = function (rect) {
    Window_SkillList.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.windowskin = ImageManager.loadSystem("Window20");
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/skill/', 'skillBack');
    this.createCursorSprite();
};

Window_NewSkillList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        // this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 4;
        this._cursorSprites.y = this._cursorSprite.y + 12;
    } else {
        this._cursorSprites.visible = false;
    }
};

/*Quest*/
Scene_Quest.prototype.questInfoWindowRect = function () {
    const wx = 596;
    const wy = 176;
    const ww = 490;
    const wh = 450;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Quest.prototype.questTypeWindowRect = function () {
    const ww = 1000;
    const wh = 80;
    const wx = 124;
    const wy = 96;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Quest.prototype.questTypeWindowRect_X = function () {
    const ww = 406;
    const wh = 80;
    const wx = 174;
    const wy = 160;
    return new Rectangle(wx, wy, ww, wh);
};

Window_QuestType.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/quest/', 'cursor');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_QuestType.prototype.itemRect = function (index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    if (index == 1) {
        var ofx = -30;
        var ofy = 0;
    } else if (index == 2) {
        var ofx = 52;
        var ofy = 2;
    } else {
        var ofx = 0;
        var ofy = 0;
    }
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX() + ofx;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY() + ofy;
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_QuestType_X.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/quest/', 'cursor');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_QuestList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._list = [];
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/quest/', 'questBack');
    this.createCursorSprite();
}

Window_QuestList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/quest/', 'cursor');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_QuestInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 18;
    this.resetTextColor();
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
};

/*Sm*/
Scene_SM.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow_X();
    this.createCommandWindow();
    this.createInfoWindow();
    this.createSmSprite();
    this.createYSprite();
    this.createGoldLsWindow();
};

Scene_SM.prototype.createCommandWindow_X = function () {
    const rect = this.commandWindowRectX();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("load", this.commandLoad.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("sm", this.commandSm.bind(this));
    commandWindow.setHandler("pet", this.commandPet.bind(this));
    commandWindow.setHandler("cancel", this.cancelCommand.bind(this));
    commandWindow.setHandler("任务", this.commandQuest.bind(this));
    commandWindow.setHandler("cy", this.commandCy.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow_x = commandWindow;
    this._commandWindow_x.deactivate();
};

// Scene_SM.prototype.cancelCommand = function () {
//     SceneManager.goto(Scene_Map)
// };

Scene_SM.prototype.onPersonalOk = function () {
    switch (this._commandWindow_x.currentSymbol()) {
        case "skill":
            if (SceneManager._scene instanceof Scene_Skill) {
                this._skillTypeWindow.activate();
                this._skillTypeWindow.select(0);
                break;
            }
            SceneManager.push(Scene_Skill);
            break;
        case "equip":
            if (SceneManager._scene instanceof Scene_Equip) {
                this._commandWindow.activate();
                this._commandWindow.select(0);
                break;
            }
            SceneManager.push(Scene_Equip);
            break;
        case "status":
            if (SceneManager._scene instanceof Scene_Status) {
                SoundManager.playBuzzer();
                this._commandWindow.activate();
                break;
            }
            SceneManager.push(Scene_Status);
            break;
    }
};

Scene_SM.prototype.commandWindowRectX = function () {
    const ww = 160;
    const wh = 522;
    const wx = Graphics.width - ww - 40;
    const wy = 88 + 54;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_SM.prototype.infoWindowRect = function () {
    const wx = 786;
    const wy = 112;
    const ww = 390;
    const wh = 470;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_SM.prototype.commandWindowRect = function () {
    const wx = 856 + 2000;
    const wy = 502;
    const ww = 200;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_SM.prototype.createSmSprite = function () {
    this._smSprite_1 = new Sprite_Sm();
    this._smSprite_1.setId(1);
    this.addChild(this._smSprite_1);
    this._smSprite_1.x = 626;
    this._smSprite_1.y = 79;

    this._smSpriteText_1 = new Sprite_SmText();
    this._smSpriteText_1.setId(1);
    this.addChild(this._smSpriteText_1);
    this._smSpriteText_1.x = 627 - 1;
    this._smSpriteText_1.y = 79 + 130 - 2;

    this._smSprite_2 = new Sprite_Sm();
    this._smSprite_2.setId(2);
    this.addChild(this._smSprite_2);
    this._smSprite_2.x = 100;
    this._smSprite_2.y = 79;

    this._smSpriteText_2 = new Sprite_SmText();
    this._smSpriteText_2.setId(2);
    this.addChild(this._smSpriteText_2);
    this._smSpriteText_2.x = 101 - 1;
    this._smSpriteText_2.y = 79 + 130 - 2;

    this._smSprite_3 = new Sprite_Sm();
    this._smSprite_3.setId(3);
    this.addChild(this._smSprite_3);
    this._smSprite_3.x = 626;
    this._smSprite_3.y = 292;

    this._smSpriteText_3 = new Sprite_SmText();
    this._smSpriteText_3.setId(3);
    this.addChild(this._smSpriteText_3);
    this._smSpriteText_3.x = 627 - 1;
    this._smSpriteText_3.y = 292 + 130 - 2;

    this._smSprite_4 = new Sprite_Sm();
    this._smSprite_4.setId(4);
    this.addChild(this._smSprite_4);
    this._smSprite_4.x = 100;
    this._smSprite_4.y = 292;

    this._smSpriteText_4 = new Sprite_SmText();
    this._smSpriteText_4.setId(4);
    this.addChild(this._smSpriteText_4);
    this._smSpriteText_4.x = 101 - 1;
    this._smSpriteText_4.y = 292 + 130 - 2;

    // this._actorSprite = new Sprite_SmImg();
    // this.addChild(this._actorSprite);
    $gameTemp._smLive2dSprite = null;
    $gameTemp._smLive2dSprite = new Sprite();
    this.addChild($gameTemp._smLive2dSprite);
    // $gameTemp._smLive2dSprite.visible = false;
    $gameTemp._smLive2dSprite.addChild(new Sprite_Live2D_Sm(1))
    $gameTemp._smLive2dSprite.visible = false;
    $gameTemp._smLive2dSprite._live2d = new Game_Live2D();
    $gameTemp._smLive2dSprite.x = 200;
    $gameTemp._smLive2dSprite.y = 0;
    $gameTemp._smLive2dSprite._live2d.setModel('lh');
    const mouthValue = $gameVariables.value(Cat.SmCore.mouthValue);
    const thoraxValue = $gameVariables.value(Cat.SmCore.thoraxValue);
    const vaginaValue = $gameVariables.value(Cat.SmCore.vaginaValue);
    const bunsValue = $gameVariables.value(Cat.SmCore.bunsValue);
    var level = this.getLevel(mouthValue);
    var level2 = this.getLevel(thoraxValue);
    var level3 = this.getLevel(vaginaValue);
    var level4 = this.getLevel(bunsValue);
    //$gameTemp._smLive2dSprite._live2d.setAnimation(0, 'idle');
    $gameTemp._smLive2dSprite.scale.set(0.35);
    if (level <= 1 && level2 <= 1 && level3 <= 1 && level4 <= 1) {
        $gameTemp._smLive2dSprite._live2d.setAnimation(0, 'idle');
    }
    else if (level <= 2 && level2 <= 2 && level3 <= 2 && level4 <= 2) {
        $gameTemp._smLive2dSprite._live2d.setAnimation(0, 'idle2');
    }
    else if (level <= 3 && level2 <= 3 && level3 <= 3 && level4 <= 3) {
        $gameTemp._smLive2dSprite._live2d.setAnimation(0, 'idle3');
    }
    else if (level <= 4 && level2 <= 4 && level3 <= 4 && level4 <= 4) {
        $gameTemp._smLive2dSprite._live2d.setAnimation(0, 'idle4');
    }
    else if (level <= 5 && level2 <= 5 && level3 <= 5 && level4 <= 5) {
        $gameTemp._smLive2dSprite._live2d.setAnimation(0, 'idle5');
    }
};

const old__Scene_SM_update = Scene_SM.prototype.update;
Scene_SM.prototype.update = function () {
    old__Scene_SM_update.call(this);
    if (this._l2dShowTime == undefined) {
        this._l2dShowTime = 0;
    }
    if ($gameTemp._smLive2dSprite && !$gameTemp._smLive2dSprite.visible) {
        this._l2dShowTime++;
        if (this._l2dShowTime >= 20) {
            $gameTemp._smLive2dSprite.visible = true;
            this._l2dShowTime = 0;
        }
    }
    const mouthValue = $gameVariables.value(Cat.SmCore.mouthValue);
    const thoraxValue = $gameVariables.value(Cat.SmCore.thoraxValue);
    const vaginaValue = $gameVariables.value(Cat.SmCore.vaginaValue);
    const bunsValue = $gameVariables.value(Cat.SmCore.bunsValue);
    var level = this.getLevel(mouthValue);
    var level2 = this.getLevel(thoraxValue);
    var level3 = this.getLevel(vaginaValue);
    var level4 = this.getLevel(bunsValue);
    if (level <= 1 && level2 <= 1 && level3 <= 1 && level4 <= 1) {
        if (TouchInput.isPressed() && this.getTouchInputXy(0, TouchInput.x, TouchInput.y) == 0) {
            AudioManager.playSe(palySe1, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(0, TouchInput.x, TouchInput.y) == 1) {
            AudioManager.playSe(palySe2, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(0, TouchInput.x, TouchInput.y) == 2) {
            AudioManager.playSe(palySe3, TouchInput.x, TouchInput.y);
        }
    } else if (level <= 2 && level2 <= 2 && level3 <= 2 && level4 <= 2) {
        if (TouchInput.isPressed() && this.getTouchInputXy(1, TouchInput.x, TouchInput.y) == 0) {
            AudioManager.playSe(palySe11, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(1, TouchInput.x, TouchInput.y) == 1) {
            AudioManager.playSe(palySe21, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(1, TouchInput.x, TouchInput.y) == 2) {
            AudioManager.playSe(palySe31, TouchInput.x, TouchInput.y);
        }
    } else if (level <= 3 && level2 <= 3 && level3 <= 3 && level4 <= 3) {
        if (TouchInput.isPressed() && this.getTouchInputXy(2, TouchInput.x, TouchInput.y) == 0) {
            AudioManager.playSe(palySe12, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(2, TouchInput.x, TouchInput.y) == 1) {
            AudioManager.playSe(palySe22, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(2, TouchInput.x, TouchInput.y) == 2) {
            AudioManager.playSe(palySe32, TouchInput.x, TouchInput.y);
        }
    } else if (level <= 4 && level2 <= 4 && level3 <= 4 && level4 <= 4) {
        if (TouchInput.isPressed() && this.getTouchInputXy(3, TouchInput.x, TouchInput.y) == 0) {
            AudioManager.playSe(palySe13, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(3, TouchInput.x, TouchInput.y) == 1) {
            AudioManager.playSe(palySe23, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(3, TouchInput.x, TouchInput.y) == 2) {
            AudioManager.playSe(palySe33, TouchInput.x, TouchInput.y);
        }
    } else if (level <= 5 && level2 <= 5 && level3 <= 5 && level4 <= 5) {
        if (TouchInput.isPressed() && this.getTouchInputXy(4, TouchInput.x, TouchInput.y) == 0) {
            AudioManager.playSe(palySe14, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(4, TouchInput.x, TouchInput.y) == 1) {
            AudioManager.playSe(palySe24, TouchInput.x, TouchInput.y);
        } else if (TouchInput.isPressed() && this.getTouchInputXy(4, TouchInput.x, TouchInput.y) == 2) {
            AudioManager.playSe(palySe34, TouchInput.x, TouchInput.y);
        }
    }
};

Scene_SM.prototype.getTouchInputXy = function (id, x, y) {
    if (TouchInputData[id]) {
        for (let s = 0; s < TouchInputData[id].length; s++) {
            const element = TouchInputData[id][s];
            if (x >= element[0] && x <= element[1] && y >= element[2] && y <= element[3]) {
                return s;
            };
        }
    }
    return -1;
};

Scene_SM.prototype.getLevel = function (value) {
    if (value <= 100) {
        return 1;
    } else if (value > 100 && value <= 300) {
        return 2;
    } else if (value > 300 && value <= 600) {
        return 3;
    } else if (value > 600 && value <= 1000) {
        return 4;
    } else {
        return 5;
    }
};

Scene_SM.prototype.createYSprite = function () {
    this._ySprite = new Sprite();
    this.addChild(this._ySprite);
    this._ySprite.bitmap = ImageManager.loadBitmap('img/newUi/sm/', 'yBack');
};

Window_SmCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/sm/', 'cursor');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_SmInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 18;//字体大小
    this.resetTextColor();
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
};

Window_SmInfo.prototype.refresh = function () {
    this.contents.clear();
    this.contents.fontSize = 20;//字体大小
    const zText = Cat.SmCore.zText;
    const nText = Cat.SmCore.nText;
    const pText = Cat.SmCore.pText;
    const xText = Cat.SmCore.xText;
    const mouthValue = $gameVariables.value(Cat.SmCore.mouthValue);
    const thoraxValue = $gameVariables.value(Cat.SmCore.thoraxValue);
    const vaginaValue = $gameVariables.value(Cat.SmCore.vaginaValue);
    const bunsValue = $gameVariables.value(Cat.SmCore.bunsValue);
    var x = 0;
    var y = 0;
    var ofy = 32;
    var ofx = 120;
    if (mouthValue <= 100) {
        var info = zText[0];
    } else if (mouthValue > 100 && mouthValue <= 300) {
        var info = zText[1];
    } else if (mouthValue > 300 && mouthValue <= 600) {
        var info = zText[2];
    } else if (mouthValue > 600 && mouthValue <= 1000) {
        var info = zText[3];
    } else {
        var info = zText[4];
    }
    this.drawTextEx('嘴巴内心：' + info, x, y, this.width, 'left');
    y += ofy;
    if (thoraxValue <= 100) {
        var info = nText[0];
    } else if (thoraxValue > 100 && thoraxValue <= 300) {
        var info = nText[1];
    } else if (thoraxValue > 300 && thoraxValue <= 600) {
        var info = nText[2];
    } else if (thoraxValue > 600 && thoraxValue <= 1000) {
        var info = nText[3];
    } else {
        var info = nText[4];
    }
    this.drawTextEx('胸内心：' + info, x, y, this.width, 'left');
    y += ofy;
    if (vaginaValue <= 100) {
        var info = xText[0];
    } else if (vaginaValue > 100 && vaginaValue <= 300) {
        var info = xText[1];
    } else if (vaginaValue > 300 && vaginaValue <= 600) {
        var info = xText[2];
    } else if (vaginaValue > 600 && vaginaValue <= 1000) {
        var info = xText[3];
    } else {
        var info = xText[4];
    }
    this.drawTextEx('小穴内心：' + info, x, y, this.width, 'left');
    y += ofy;
    if (bunsValue <= 100) {
        var info = pText[0];
    } else if (bunsValue > 100 && bunsValue <= 300) {
        var info = pText[1];
    } else if (bunsValue > 300 && bunsValue <= 600) {
        var info = pText[2];
    } else if (bunsValue > 600 && bunsValue <= 1000) {
        var info = pText[3];
    } else {
        var info = pText[4];
    }
    this.drawTextEx('后庭内心：' + info, x, y, this.width, 'left');
    y += ofy;
    const text = ['与人类次数：', '与怪物次数：', '被性骚扰次数：', '使用道具次数次数：', '强奸次数：',
        '轮奸次数：', '引诱次数：', '强推次数：', '口交次数：', '乳交次数：', '肛交次数：'];
    this.drawTextEx(text[0] + $gameVariables.value(Cat.SmCore.value_1), x, y, this.width);
    //var x = ofx;
    y += ofy;
    this.drawTextEx(text[1] + $gameVariables.value(Cat.SmCore.value_2), x, y, this.width);
    y += ofy;
    var x = 0;
    this.drawTextEx(text[2] + $gameVariables.value(Cat.SmCore.value_3), x, y, this.width);
    y += ofy;
    this.drawTextEx(text[3] + $gameVariables.value(Cat.SmCore.value_4), x, y, this.width);
    y += ofy;
    this.drawTextEx(text[4] + $gameVariables.value(Cat.SmCore.value_5), x, y, this.width);
    var x = ofx;
    this.drawTextEx(text[5] + $gameVariables.value(Cat.SmCore.value_6), x, y, this.width);
    y += ofy;
    var x = 0;
    this.drawTextEx(text[6] + $gameVariables.value(Cat.SmCore.value_7), x, y, this.width);
    var x = ofx;
    this.drawTextEx(text[7] + $gameVariables.value(Cat.SmCore.value_8), x, y, this.width);
    y += ofy;
    var x = 0;
    this.drawTextEx(text[8] + $gameVariables.value(Cat.SmCore.value_9), x, y, this.width);
    var x = ofx;
    this.drawTextEx(text[9] + $gameVariables.value(Cat.SmCore.value_10), x, y, this.width);
    y += ofy;
    var x = 0;
    this.drawTextEx(text[10] + $gameVariables.value(Cat.SmCore.value_11), x, y, this.width);
};

Sprite_SmImg.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.refresh();
};

Sprite_SmImg.prototype.refresh = function () {
    const mouthValue = $gameVariables.value(Cat.SmCore.mouthValue);
    const thoraxValue = $gameVariables.value(Cat.SmCore.thoraxValue);
    const vaginaValue = $gameVariables.value(Cat.SmCore.vaginaValue);
    const bunsValue = $gameVariables.value(Cat.SmCore.bunsValue);
    var level = this.getLevel(mouthValue);
    var level2 = this.getLevel(thoraxValue);
    var level3 = this.getLevel(vaginaValue);
    var level4 = this.getLevel(bunsValue);
    if (level <= 1 && level2 <= 1 && level3 <= 1 && level4 <= 1) {
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', 's_1');
    }
    else if (level <= 2 && level2 <= 2 && level3 <= 2 && level4 <= 2) {
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', 's_2');
    }
    else if (level <= 3 && level2 <= 3 && level3 <= 3 && level4 <= 3) {
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', 's_3');
    }
    else if (level <= 4 && level2 <= 4 && level3 <= 4 && level4 <= 4) {
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', 's_4');
    }
    else if (level <= 5 && level2 <= 5 && level3 <= 5 && level4 <= 5) {
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', 's_5');
    }
};

/*Pet*/
Scene_LL_Pet.prototype.createUseListWindow = function () {
    this._equipItemSprite = new Sprite();
    this.addChild(this._equipItemSprite);
    this._equipItemSprite.hide();
    this._equipItemSprite.bitmap = ImageManager.loadBitmap('img/newUi/lc/', 'itemList');
    this._equipItemSprite.anchor.set(0.5);

    const rect = this.petUseListWindowRect();
    this._petUseListWindow = new Window_PetUseList(rect);
    this._petUseListWindow.setHandler('ok', this.onUse.bind(this));
    this._petUseListWindow.setHandler('cancel', this.cancelUse.bind(this));
    this.addChild(this._petUseListWindow);
    this._petUseListWindow.deactivate();
    this._petUseListWindow.hide();

    this._equipItemSprite.x = this._petUseListWindow.x + 170;
    this._equipItemSprite.y = this._petUseListWindow.y + 228;
};

Window_PetUseList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this._actor = null;
    this._type = -1;
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/lc/', 'listBack');
    this.createCursorSprite();
};

Scene_LL_Pet.prototype.petListWindowRect = function () {
    const ww = 220;
    const wh = 214;
    const wx = 125;
    const wy = 90;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LL_Pet.prototype.petCommandWindowRect = function () {
    const ww = 500;
    const wh = 130;
    const wx = 650;
    const wy = 100;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LL_Pet.prototype.petParamWindowRect = function () {
    const ww = 372;
    const wh = 226;
    const wx = 756;
    const wy = 240;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LL_Pet.prototype.petSkillWindowRect = function () {
    const ww = 370;
    const wh = 170;
    const wx = this._statusWindow.x - 40;
    const wy = this._statusWindow.y + 230;
    return new Rectangle(wx, wy, ww, wh);
};

Window_PetList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = false;
    this.windowskin = ImageManager.loadSystem("Window20");
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/lc/', 'petBack');
    this.createCursorSprite();
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
            this.contents.outlineWidth = 3;
        }
        this.drawText(pet.name, rect.x + 10, rect.y - 8, this.width, 'left')
        const pets = $gameActors.actor(pet.id)
        const petIndex = $gameParty.allMembers().indexOf(pets);
        if (petIndex != -1) {
            var note = '[已参战]';
            this.changeTextColor('#0dfb48');
        }
        else {
            this.changeTextColor('#1f9dec');
            this.contents.outlineColor = '#1f9dec';
            this.contents.outlineWidth = 1;
            var note = '[休息]';
        }
        this.contents.fontSize = 16;
        this.drawText(note, rect.x, rect.y + 14, this.itemWidth() - 30, 'right')
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
        const scw = 180;
        const sch = ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};

Window_NewPetCommand.prototype.itemRect = function (index) {
    if (index == 0) {
        var x = 25;
        var y = 0;
        var width = 115;
        var height = 50;
    } else if (index == 1) {
        var x = 166;
        var y = 0;
        var width = 115;
        var height = 50;
    } else if (index == 2) {
        var x = 306;
        var y = 0;
        var width = 115;
        var height = 50;
    } else if (index == 3) {
        var x = 0;
        var y = 65;
        var width = 230;
        var height = 50;
    } else {
        var x = 316;
        var y = 65;
        var width = 115;
        var height = 50;
    }
    return new Rectangle(x, y, width, height);
};

/*LetterNpc*/
Scene_LetterNpc.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow_X();
    this._commandWindow_x.deactivate();
    this.createTimeWindow()
    this.createtypeListWindow();
    this.createNpcTypeListWindow();
    this.createChlidrenListWindow();
    this.createNpcInfoWindow();
    // this.createBackWindow();
    this.createInfoWindow();
    this.createCommandWindow();
    this._childrenSprite = new Sprite();
    this.addChild(this._childrenSprite);
    this._childrenSprite.anchor.set(0.5);
    this._childrenSprite.scale.x = 0.9;
    this._childrenSprite.scale.y = 0.75;
    this._childrenSprite.x = 967;
    this._childrenSprite.y = 379;
    this.createActionCommandWindow();
};

Scene_LetterNpc.prototype.onNpcTypelist = function () {
    if (this._npcTypeListWindow.index() == 4) {
        this.cancelNpcTypeList();
        return;
    }
    if (this._chListWindow._list.length < 1) {
        SoundManager.playBuzzer();
        this._npcTypeListWindow.activate();
        return;
    }
    this._npcTypeListWindow.deactivate();
    this._chListWindow.activate();
    this._lastIndex = -1;
    this._chListWindow.select(0);
};

Scene_LetterNpc.prototype.infoWindowRect = function () {
    const ww = 480;
    const wh = 330;
    const wx = 332;
    const wy = 200;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.commandWindowRectX = function () {
    const ww = 160;
    const wh = 522;
    const wx = Graphics.width - ww - 40;
    const wy = 88 + 54;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.npcTypeListWindowRect = function () {
    const ww = 850;
    const wh = 80;
    const wx = 220;
    const wy = 76;
    return new Rectangle(wx, wy, ww, wh);
};

Window_NpcTypeListCommand.prototype.refresh = function () {
    this.createContents();
    this._list = [];
    this._list = ['普通', '道侣', '好友', '敌对'];
    this.drawAllItems();
};

Window_NpcTypeListCommand.prototype.maxCols = function () {
    return 5;
};

Window_NpcTypeListCommand.prototype.itemRect = function (index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    if (index == 1) {
        var ofx = -20;
        var ofy = 0;
    } else if (index == 2) {
        var ofx = -44;
        var ofy = 0;
    } else if (index == 3) {
        var ofx = -68;
        var ofy = 0;
    } else if (index == 4) {
        var ofx = -10;
        var ofy = 5;
    } else {
        var ofx = 4;
        var ofy = 0;
    }
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX() + ofx;
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY() + ofy;
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Scene_LetterNpc.prototype.chListWindowRect = function () {
    const ww = 170;
    const wh = 468;
    const wx = 186;
    const wy = 146;
    return new Rectangle(wx, wy, ww, wh);
};

Window_LetterNpcList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.createCursorSprite();
};

Window_LetterNpcList.prototype.drawBackgroundRect = function (rect) {
};

Window_LetterNpcList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 10;
        this._cursorSprites.y = this._cursorSprite.y + 15;
    } else {
        this._cursorSprites.visible = false;
    }
};

/*Save*/
Scene_File.prototype.listWindowRect = function () {
    const wx = 140;
    const wy = 130;
    const ww = 460;
    const wh = 466;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_File.prototype.helpWindowRect = function () {
    const wx = 160;
    const wy = 86;
    const ww = 943;
    const wh = 80;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Save.prototype.onSaveSuccess = function () {
    this._listWindow.refresh();
    SoundManager.playSave();
    if ($gameSystem._onCommandLoad) {
        this.popScene();
    } else {
        this._listWindow.loadSaveBitmap();
        this._commandWindow.activate();
        SceneManager.goto(Scene_Map)
    }
};

Window_newSavefileList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._mapSprite = new Sprite_SaveMap();
    this._mapSprite.setWindow(this);
    this.addChild(this._mapSprite);
    this._mapSprite.x = 509;
    this._mapSprite.y = 97;
    this._mapSprite.scale.set(0.96)
    this.windowskin = ImageManager.loadSystem("Window20");
    this.loadSaveBitmap();
    this.activate();
    this._mode = null;
    this._autosave = false;
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/save/', 'back');
    this.createCursorSprite();
};

Window_newSavefileList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 10;
        const dy = rect.y - 6;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

Window_NewSaveHelp.prototype.refresh = function () {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 22;
    this.changeTextColor('#462a39');
    this.drawText(this._text, rect.x, rect.y, rect.width, 'center');
};

Sprite_SaveMap.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._textSprite = new Sprite();
    this._textSprite.bitmap = new Bitmap(200, 100);
    this._textSprite.bitmap.fontSize = 22;
    this._textSprite.bitmap.textColor = '#462a39';
    this._textSprite.bitmap.outlineColor = '#462a39';
    this._textSprite.bitmap.outlineWidth = 1;
    this.addChild(this._textSprite);
    this._textSprite.x = 190;
    this._textSprite.y = 272;
};

/*Option*/
Scene_Options.prototype.optionsWindowRect = function () {
    const ww = 870;
    const wh = 400;
    const wx = 220;
    const wy = 140;
    return new Rectangle(wx, wy, ww, wh);
};

Window_Options.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/options/', 'back');
    this.createCursorSprite();
};

Window_Options.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y - 10;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

/*Battle*/
Scene_Battle.prototype.createPartyCommandWindow = function () {
    this._partyCommandBackSprite = null;
    this._partyCommandBackSprite = new Sprite();
    this._partyCommandBackSprite.hide();
    this._partyCommandBackSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', 'db');
    this._partyCommandBackSprite.anchor.set(0.5);
    this.addChild(this._partyCommandBackSprite);
    this._partyCommandBackSprite.x = Graphics.width / 2;
    this._partyCommandBackSprite.y = Graphics.height / 2;

    const rect = this.partyCommandWindowRect();
    const commandWindow = new Window_PartyCommand(rect);
    commandWindow.setHandler("fight", this.commandFight.bind(this));
    commandWindow.setHandler("escape", this.commandEscape.bind(this));
    commandWindow.deselect();
    this.addChild(commandWindow);
    this._partyCommandWindow = commandWindow;
};

Scene_Battle.prototype.createActorCommandWindow = function () {
    this._actorCommandBackSprite = null;
    this._actorCommandBackSprite = new Sprite();
    this._actorCommandBackSprite.hide();
    this._actorCommandBackSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', "db1");
    this._actorCommandBackSprite.anchor.set(0.5);
    this.addChild(this._actorCommandBackSprite);
    this._actorCommandBackSprite.x = Graphics.width / 2;
    this._actorCommandBackSprite.y = Graphics.height / 2;

    const rect = this.actorCommandWindowRect();
    const commandWindow = new Window_ActorCommand(rect);
    commandWindow.setHandler("attack", this.commandAttack.bind(this));
    commandWindow.setHandler("skill", this.commandSkill.bind(this));
    commandWindow.setHandler("guard", this.commandGuard.bind(this));
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("cancel", this.commandCancel.bind(this));
    this.addChild(commandWindow);
    this._actorCommandWindow = commandWindow;
};

Window_PartyCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor(); 1
    this.changePaintOpacity(this.isCommandEnabled(index));
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

Window_ActorCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/battle/', 'cursor2');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};


Window_ActorCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor(); 1
    this.changePaintOpacity(this.isCommandEnabled(index));
    // this.changeTextColor('#462a39');
    // this.contents.outlineColor = '#462a39';
    // this.contents.outlineWidth = 1;
    this.changeTextColor(ColorManager.textColor(0))
    this.contents.fontSize = 22;
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Sprite_BattleActorInfo.prototype.createHpSprite = function () {
    this._hpSprite = new Sprite();
    this._hpSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', 'hp');
    this.addChild(this._hpSprite);
    this._hpSprite.x = 97;
    this._hpSprite.y = 104;
    this._hpValueSprite = new Sprite();
    this.addChild(this._hpValueSprite);
    this._hpValueSprite.x = 106;
    this._hpValueSprite.y = 99;

    this._hpNameSprite = new Sprite();
    this.addChild(this._hpNameSprite);
    this._hpNameSprite.x = 30;
    this._hpNameSprite.y = 95;
};

Sprite_BattleActorInfo.prototype.createMpSprite = function () {
    this._mpSprite = new Sprite();
    this._mpSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', 'mp');
    this.addChild(this._mpSprite);
    this._mpSprite.x = 95 + 2;
    this._mpSprite.y = 129 + 4;
    this._mpValueSprite = new Sprite();
    this.addChild(this._mpValueSprite);
    this._mpValueSprite.x = 106;
    this._mpValueSprite.y = 123 + 3;

    this._mpNameSprite = new Sprite();
    this.addChild(this._mpNameSprite);
    this._mpNameSprite.x = 30;
    this._mpNameSprite.y = 121 + 4;
};

Sprite_BattleActorInfo.prototype.createTpSprite = function () {
    this._tpSprite = new Sprite();
    this._tpSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', 'tp');
    this.addChild(this._tpSprite);
    this._tpSprite.x = 95 + 3;
    this._tpSprite.y = 154 + 7;
    this._tpValueSprite = new Sprite();
    this.addChild(this._tpValueSprite);
    this._tpValueSprite.x = 106;
    this._tpValueSprite.y = 126 + 30;

    this._tpNameSprite = new Sprite();
    this.addChild(this._tpNameSprite);
    this._tpNameSprite.x = 30;
    this._tpNameSprite.y = 125 + 28;
};

Sprite_BattleCursor.prototype.CreateCursor = function () {
    for (let i = 0; i < 8; i++) {
        this.EnemyCursor[i] = new Sprite(ImageManager.loadBitmap('img/newUi/battle/', 'enemyCursor'));
        this.EnemyCursor[i].anchor.x = 0.5;
        this.EnemyCursor[i].anchor.y = 0.5;
        this.EnemyCursor[i].visible = false;
        this.EnemyCursor[i].ymove = -32;
        this.addChild(this.EnemyCursor[i]);
    }
}

GaugeSprite.prototype.initBackground = function () {
    let bitmap = ImageManager.loadBitmap('img/newUi/battle/', 'enemyHp1');
    this._backSprite = new Sprite(bitmap);
    this.addChild(this._backSprite);
};

GaugeSprite.prototype.initGauge = function () {
    this._gaugeBitmap = ImageManager.loadBitmap('img/newUi/battle/', 'enemyHp2');;
    this._gaugeBitmap.addLoadListener(this.setGaugeBitmap.bind(this));
};

Sprite_BattleActorInfo.prototype.createNameSprite = function () {
    this._nameSprite = new Sprite();
    this.addChild(this._nameSprite);
    this._nameSprite.x = 74;
    this._nameSprite.y = 34;
};

Scene_Battle.prototype.createBackGroundSprite = function () {
    this._backGroundSprtie = new Sprite()
    this.addChild(this._backGroundSprtie)
    this._backGroundSprtie.bitmap = ImageManager.loadBitmap('img/newUi/battleEnd/', 'back2');
    this._backGroundSprtie.x = 0;
    this._backGroundSprtie.y = 0;
    this._backGroundSprtie.visible = false;
};

Scene_Battle.prototype.createNewActorPictureSprite = function () {
    this._actorNewPictureSprtie = new Sprite()
    this.addChild(this._actorNewPictureSprtie)
    this._actorNewPictureSprtie.bitmap = ImageManager.loadBitmap('img/newUi/battleEnd/', 'lh');
    this._actorNewPictureSprtie.x = 640;
    this._actorNewPictureSprtie.y = 720;
    this._actorNewPictureSprtie.anchor.x = 0.5;
    this._actorNewPictureSprtie.anchor.y = 1;
    this._actorNewPictureSprtie.visible = false;
    this._actorPicturebreatheCount = 0;
};

Window_ChoiceList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/options/', 'cursor2');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

/*Children*/
Scene_Map.prototype.createNewChildrenBlackSprite = function () {
    this._newChildBlackSprite = new Sprite();
    this.addChild(this._newChildBlackSprite);
    this._newChildBlackSprite._oldVisible = false;
    this._newChildBlackSprite.hide();
    this._newChildBlackSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'black');
};

Scene_Map.prototype.createNewChildrenBackWindow = function () {
    this._newChildBackSprite = new Sprite();
    this.addChild(this._newChildBackSprite);
    this._newChildBackSprite.hide();
    this._newChildBackSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'childrenBack');

    this._newChildActorSprite = new Sprite();
    this.addChild(this._newChildActorSprite);

    const rect = this.newChildrenInfoWindowRect();
    this._newChildrenInfoWindow = new Window_NewChildrenInfo(rect);
    this.addChild(this._newChildrenInfoWindow);
    this._newChildrenInfoWindow.hide();
};

Window_MenuCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y - 2;
    if (this.index() >= 0) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 4;
        this._cursorSprites.y = this._cursorSprite.y + 3;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_NewItemCategory.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        if (this.index() == 0) {
            var ofx = -10;
        } else if (this.index() == 3) {
            var ofx = -10;
        } else if (this.index() == 4) {
            var ofx = -10;
        } else {
            var ofx = 15;
        }
        // this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 14 + ofx;
        this._cursorSprites.y = this._cursorSprite.y + 16;
    } else {
        this._cursorSprites.visible = false;
    }
};