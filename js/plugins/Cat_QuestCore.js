//=============================================================================
// RPG Maker MZ - 任务
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<任务>
 * @author Cat
 * 
 * @param quest
 * @text 主线任务设置
 * @type struct<questCustom>[]
 * @default
 * 
 * @param quest_x
 * @text 支线任务设置
 * @type struct<questCustom>[]
 * @default
 * 
 * @command addQuest
 * @text 添加主线/支线任务
 * @desc 添加主线/支线任务
 *
 * @arg type
 * @text 任务类型
 * @type select
 * @option 主线
 * @value 主线
 * @option 支线
 * @value 支线
 * 
 * @arg id
 * @type number
 * @default 1
 * @text 任务Id号
 * @desc 写入任务Id号
 * @min 1
 * 
 * @command removeQuest
 * @text 主线/支线任务完成
 * @desc 主线/支线任务完成
 * 
 * @arg type
 * @text 任务类型
 * @type select
 * @option 主线
 * @value 主线
 * @option 支线
 * @value 支线
 * 
 * @arg id
 * @type number
 * @default 1
 * @text 任务Id号
 * @desc 写入任务Id号
 * @min 1
 * 
 * @command nextQuest
 * @text 任务进入下一进度
 * @desc 任务进入下一进度
 *
 * @arg type
 * @text 任务类型
 * @type select
 * @option 主线
 * @value 主线
 * @option 支线
 * @value 支线
 * 
 * @arg id
 * @type number
 * @default 1
 * @text 任务Id号
 * @desc 写入任务Id号
 * @min 1
 * 
 * @help
 * 插件指令：
 * 添加任务：主线or支线任务
 * 任务进入下一进度：主线or支线任务
 * 任务完成：主线or支线任务
 */

/*~struct~questCustom:
@param questName
@text 任务名称
@type string

@param questTask
@text 任务进度
@type note[]
*/

'use strict';
var Imported = Imported || {};
Imported.Cat_QuestCore = true;

var Cat = Cat || {};
Cat.QuestCore = {};
Cat.QuestCore.parameters = PluginManager.parameters('Cat_QuestCore');
Cat.QuestCore.data = JSON.parse(Cat.QuestCore.parameters['quest'] || '[]');
Cat.QuestCore.data_x = JSON.parse(Cat.QuestCore.parameters['quest_x'] || '[]');

if (Cat.QuestCore.data) {
    const max = Cat.QuestCore.data.length;
    for (let i = 0; i < max; i++) {
        Cat.QuestCore.data[i] = JSON.parse(Cat.QuestCore.data[i])
        Cat.QuestCore.data[i].id = i + 1;
        Cat.QuestCore.data[i].questTask = JSON.parse(Cat.QuestCore.data[i].questTask)
        for (let s = 0; s < Cat.QuestCore.data[i].questTask.length; s++) {
            if (Cat.QuestCore.data[i].questTask[s]) {
                Cat.QuestCore.data[i].questTask[s] = JSON.parse(Cat.QuestCore.data[i].questTask[s])
            }
        }
    }
    //console.log(Cat.QuestCore.data)
};

if (Cat.QuestCore.data_x) {
    const max = Cat.QuestCore.data_x.length;
    for (let i = 0; i < max; i++) {
        Cat.QuestCore.data_x[i] = JSON.parse(Cat.QuestCore.data_x[i])
        Cat.QuestCore.data_x[i].id = i + 1;
        Cat.QuestCore.data_x[i].questTask = JSON.parse(Cat.QuestCore.data_x[i].questTask)
        for (let s = 0; s < Cat.QuestCore.data_x[i].questTask.length; s++) {
            if (Cat.QuestCore.data_x[i].questTask[s]) {
                Cat.QuestCore.data_x[i].questTask[s] = JSON.parse(Cat.QuestCore.data_x[i].questTask[s])
            }
        }
    }
    //console.log(Cat.QuestCore.data_x)
};

PluginManager.registerCommand('Cat_QuestCore', 'addQuest', args => {
    const id = Number(args.id);
    const type = String(args.type);
    $gameSystem.addQuest(id, type);
});

PluginManager.registerCommand('Cat_QuestCore', 'removeQuest', args => {
    const id = Number(args.id);
    const type = String(args.type);
    $gameSystem.removeQuest(id, type);
});

PluginManager.registerCommand('Cat_QuestCore', 'nextQuest', args => {
    const id = Number(args.id);
    const type = String(args.type);
    $gameSystem.nextQuest(id, type);
});

Cat.QuestCore.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    Cat.QuestCore.Game_System_initialize.call(this);
    this.getMainQuestData();
    this.getMinorQuestData();
    this._mainQuest = [];
    this._mainCompleteQuest = [];
    this._minorQuest = [];
    this._minorCompleteQuest = [];
};

Game_System.prototype.getMainQuestData = function () {
    this._mainQuestData = Cat.QuestCore.data;
};

Game_System.prototype.getMinorQuestData = function () {
    this._minorQuestData = Cat.QuestCore.data_x;
};

Game_System.prototype.getMainQuestList = function () {
    return this._mainQuest;
};

Game_System.prototype.getMinorQuestList = function () {
    return this._minorQuest;
};

Game_System.prototype.getMainCompleteQuestList = function () {
    return this._mainCompleteQuest;
};

Game_System.prototype.getMinorCompleteQuestList = function () {
    return this._minorCompleteQuest;
};

Game_System.prototype.addQuest = function (id, type) {
    // console.log(id, type)
    if (type == '主线') {
        this.getMainQuestData();
        const quest = this._mainQuestData[id - 1];
        if (quest && !this._mainQuest.includes(quest)) {
            this._mainQuest[id - 1] = JsonEx.makeDeepCopy(quest);
            this._mainQuest[id - 1].taskNumber = 0;
        }
    } else if (type == '支线') {
        this.getMinorQuestData();
        const quest = this._minorQuestData[id - 1];
        if (quest && !this._minorQuest.includes(quest)) {
            this._minorQuest[id - 1] = JsonEx.makeDeepCopy(quest);
            this._minorQuest[id - 1].taskNumber = 0;
        }
    }
};

Game_System.prototype.nextQuest = function (id, type) {
    if (type == '主线') {
        this.getMainQuestData();
        const quest = this._mainQuest[id - 1];
        if (quest) {
            this._mainQuest[id - 1].taskNumber++;
            if (this._mainQuest[id - 1].taskNumber >= this._mainQuest[id - 1].questTask.length) {
                this._mainQuest[id - 1].taskNumber = this._mainQuest[id - 1].questTask.length - 1;
            }
        }
    } else if (type == '支线') {
        this.getMinorQuestData();
        const quest = this._minorQuest[id - 1];
        if (quest) {
            this._minorQuest[id - 1].taskNumber++;
            if (this._minorQuest[id - 1].taskNumber >= this._minorQuest[id - 1].questTask.length) {
                this._minorQuest[id - 1].taskNumber = this._minorQuest[id - 1].questTask.length - 1;
            }
        }
    }
};

Game_System.prototype.removeQuest = function (id, type) {
    if (type == '主线') {
        this.getMainQuestData();
        const quest = this._mainQuest[id - 1];
        if (quest && !this._mainCompleteQuest.includes(quest)) {
            this._mainCompleteQuest[id - 1] = JsonEx.makeDeepCopy(quest);
            this._mainQuest[id - 1] = null;
        }
    } else if (type == '支线') {
        this.getMinorQuestData();
        const quest = this._minorQuest[id - 1];
        if (quest && !this._minorCompleteQuest.includes(quest)) {
            this._minorCompleteQuest[id - 1] = JsonEx.makeDeepCopy(quest);
            this._minorQuest[id - 1] = null;
        }
    };
};

function Scene_Quest() {
    this.initialize(...arguments);
}

Scene_Quest.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Quest.prototype.constructor = Scene_Quest;

Scene_Quest.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._selectType = 0;
    this._selectTypeX = 0;
};

Scene_Quest.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createTimeWindow();
    this._commandWindow.deactivate();
    this.createQuestTypeWindow();
    this.createQuestTypeWindow_X();
    this.createQuestListWindow();
    this.createQuestInfoWindow();
};

Scene_Quest.prototype.createQuestInfoWindow = function () {
    const rect = this.questInfoWindowRect();
    this._questInfoWindow = new Window_QuestInfo(rect);
    this.addChild(this._questInfoWindow);
};

Scene_Quest.prototype.questInfoWindowRect = function () {
    const wx = 590;
    const wy = 176;
    const ww = 482;
    const wh = 450;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Quest.prototype.createQuestTypeWindow = function () {
    const rect = this.questTypeWindowRect();
    this._questTypeWindow = new Window_QuestType(rect);
    this._questTypeWindow.setHandler('mainQuest', this.onMainQuest.bind(this));
    this._questTypeWindow.setHandler('minorQuest', this.onMinorQuest.bind(this));
    this._questTypeWindow.setHandler("cancel", this.cancelQuest.bind(this));
    this.addChild(this._questTypeWindow);
    this._questTypeWindow.activate();
    this._questTypeWindow.select(0);
};

Scene_Quest.prototype.onMainQuest = function () {
    this._selectType = 1;
    this._questTypeWindow.deactivate();
    this._questTypeWindow_X.activate();
    this._questTypeWindow_X.select(0);
};

Scene_Quest.prototype.onMinorQuest = function () {
    this._selectType = 2;
    this._questTypeWindow.deactivate();
    this._questTypeWindow_X.activate();
    this._questTypeWindow_X.select(0);
};

Scene_Quest.prototype.cancelQuest = function () {
    // this._questTypeWindow.deactivate();
    // this._commandWindow.activate();
    SceneManager.goto(Scene_Status);
};

Scene_Quest.prototype.questTypeWindowRect = function () {
    const ww = 885;
    const wh = 80;
    const wx = 144;
    const wy = 96;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Quest.prototype.createQuestTypeWindow_X = function () {
    const rect = this.questTypeWindowRect_X();
    this._questTypeWindow_X = new Window_QuestType_X(rect);
    this._questTypeWindow_X.setHandler('failQuest', this.onFailQuest.bind(this));
    this._questTypeWindow_X.setHandler('completeQuest', this.onCompleteQuest.bind(this));
    this._questTypeWindow_X.setHandler("cancel", this.cancelQuestX.bind(this));
    this.addChild(this._questTypeWindow_X);
    this._questTypeWindow_X.deactivate();
};

Scene_Quest.prototype.questTypeWindowRect_X = function () {
    const ww = 400;
    const wh = 80;
    const wx = 174;
    const wy = 160;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Quest.prototype.onFailQuest = function () {
    this._selectTypeX = 1;
    this._questListWindow.refresh();
    this._questListWindow.activate();
    this._questListWindow.select(0);
};

Scene_Quest.prototype.onCompleteQuest = function () {
    this._selectTypeX = 2;
    this._questListWindow.refresh();
    this._questListWindow.activate();
    this._questListWindow.select(0);
};

Scene_Quest.prototype.cancelQuestX = function () {
    this._questTypeWindow_X.deselect();
    this._questTypeWindow_X.deactivate();
    this._questTypeWindow.activate();
};

Scene_Quest.prototype.createQuestListWindow = function () {
    const rect = this.questListWindowRect();
    this._questListWindow = new Window_QuestList(rect);
    this._questListWindow.setHandler("cancel", this.cancelQusetListWindow.bind(this));
    this.addChild(this._questListWindow);
};

Scene_Quest.prototype.cancelQusetListWindow = function () {
    this._questListWindow.deselect();
    this._questListWindow.deactivate();
    this._questTypeWindow_X.activate();
};

Scene_Quest.prototype.questListWindowRect = function () {
    const ww = 400;
    const wh = 414;
    const wx = 190;
    const wy = 210;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Quest.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._questTypeWindow) {
        const index = this._questTypeWindow.index();
        if (index == 0) {
            this._selectType = 1;
        } else if (index == 1) {
            this._selectType = 2;
        } else {
            this._selectType = 0;
        }
    }
    if (this._questTypeWindow_X) {
        const index = this._questTypeWindow_X.index();
        if (index == 0) {
            this._selectTypeX = 1;
        } else if (index == 1) {
            this._selectTypeX = 2;
        } else {
            this._selectTypeX = 0;
        }
    }
    if (this._selectType > 0 && this._selectTypeX > 0) {
        const index = this._questTypeWindow_X.index();
        if (index != this._lastIndex) {
            this._questListWindow.refresh();
        };
        if (this._questInfoWindow) {
            const indexs = this._questListWindow.index();
            const quest = this._questListWindow._list[indexs];
            if (quest) {
                const questTask = quest.questTask[quest.taskNumber];
                if (questTask) {
                    this._questInfoWindow.refresh(questTask);
                }
            } else {
                this._questInfoWindow.createContents();
            }
        };
    };
};

function Window_QuestType() {
    this.initialize(...arguments);
};

Window_QuestType.prototype = Object.create(Window_Command.prototype);
Window_QuestType.prototype.constructor = Window_QuestType;

Window_QuestType.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.createCursorSprite();
    this.refresh();
};

Window_QuestType.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/quest/', '光标1');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_QuestType.prototype.update = function () {
    Window_Command.prototype.update.call(this);
};

Window_QuestType.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 35;
        this._cursorSprites.y = this._cursorSprite.y + 2;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_QuestType.prototype.makeCommandList = function () {
    this.addCommand('主线任务', 'mainQuest', true);
    this.addCommand('支线任务', 'minorQuest', true);
    //  this.addCommand('返回', 'cancel', true);
};

Window_QuestType.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 30;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(this.commandName(index), rect.x + 16, rect.y, rect.width, align);
};

Window_QuestType.prototype.maxItems = function () {
    return 2;
};

Window_QuestType.prototype.numVisibleRows = function () {
    return 1;
};

Window_QuestType.prototype.maxCols = function () {
    return 3;
};

Window_QuestType.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_QuestType.prototype.drawBackgroundRect = function (rect) {
};


function Window_QuestType_X() {
    this.initialize(...arguments);
};

Window_QuestType_X.prototype = Object.create(Window_Command.prototype);
Window_QuestType_X.prototype.constructor = Window_QuestType_X;

Window_QuestType_X.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._lastIndex = null;
    this.createCursorSprite();
    this.refresh();
};

Window_QuestType_X.prototype.setQuestListWindow = function (window) {
    this._questListWindow = window;
};

Window_QuestType_X.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/quest/', '光标1');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_QuestType_X.prototype.update = function () {
    Window_Command.prototype.update.call(this);
};

// Cat.QuestCore.Window_SavefileList_select = Window_SavefileList.prototype.select;
// Window_QuestType_X.prototype.select = function (index) {
//     Cat.QuestCore.Window_SavefileList_select.call(this, index);
//     if (index != this._lastIndex) {
//         this._questListWindow.refresh();
//         this._lastIndex = index;
//     }
// };

Window_QuestType_X.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 15;
        this._cursorSprites.y = this._cursorSprite.y + 2;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_QuestType_X.prototype.makeCommandList = function () {
    this.addCommand('未完成', 'failQuest', true);
    this.addCommand('已完成', 'completeQuest', true);
};

Window_QuestType_X.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 30;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(this.commandName(index), rect.x + 16, rect.y, rect.width, align);
};

Window_QuestType_X.prototype.maxItems = function () {
    return 2;
};

Window_QuestType_X.prototype.numVisibleRows = function () {
    return 1;
};

Window_QuestType_X.prototype.maxCols = function () {
    return 2;
};

Window_QuestType_X.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_QuestType_X.prototype.drawBackgroundRect = function (rect) {
};

function Window_QuestList() {
    this.initialize(...arguments);
};

Window_QuestList.prototype = Object.create(Window_Selectable.prototype);
Window_QuestList.prototype.constructor = Window_QuestList;

Window_QuestList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._list = [];
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/quest/', '底框');
    this.createCursorSprite();
}

Window_QuestList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/quest/', '光标1');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_QuestList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_QuestList.prototype.maxCols = function () {
    return 1;
};

Window_QuestList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};

Window_QuestList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_QuestList.prototype.numVisibleRows = function () {
    return 6;
};

Window_QuestList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 20;
        this._cursorSprites.y = this._cursorSprite.y + 14;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_QuestList.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];
    const type = SceneManager._scene._selectType;
    const typex = SceneManager._scene._selectTypeX;
    if (type > 0 && typex > 0) {
        if (type == 1) {
            if (typex == 1) {
                var list = $gameSystem.getMainQuestList();
            } else {
                var list = $gameSystem.getMainCompleteQuestList();
            }
            this._list = list.filter(quest => quest != null)
        } else {
            if (typex == 1) {
                var list = $gameSystem.getMinorQuestList();
            } else {
                var list = $gameSystem.getMinorCompleteQuestList();
            }
            this._list = list.filter(quest => quest != null)
        }
        if (this._list.length > 0) {
            this.drawAllItems();
        }
    } else {
        return;
    }
};

Window_QuestList.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawTextEx(item.questName, rect.x + 16, rect.y + 10, rect.width);
    }
};

Window_QuestList.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 22;
    this.resetTextColor();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
};

Window_QuestList.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineWidth = 3;
    } else {
        this.contents.outlineWidth = 1;
    }
};

Window_QuestList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y;
        const sx = 0;
        const sy = 0;
        const scw = rect.width;
        const sch = ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};

Window_QuestList.prototype.drawBackgroundRect = function (rect) {
};

function Window_QuestInfo() {
    this.initialize(...arguments);
}

Window_QuestInfo.prototype = Object.create(Window_Base.prototype);
Window_QuestInfo.prototype.constructor = Window_QuestInfo;

Window_QuestInfo.prototype.initialize = function (rect) {
    Window_Help.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
};

Window_QuestInfo.prototype.refresh = function (text) {
    this.createContents();
    this.drawTextEx(text, 0, 0, this.width);
};

Window_QuestInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 20;
    this.resetTextColor();
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
};

Window_QuestInfo.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineWidth = 3;
    } else {
        this.contents.outlineWidth = 1;
    }
};