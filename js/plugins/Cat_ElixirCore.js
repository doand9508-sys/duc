//=============================================================================
// RPG Maker MZ - 炼丹核心
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<炼丹核心>
 * @author FlyCat
 * 
 * @command addElixirData
 * @text 添加丹方
 * @desc 添加丹方
 *
 * @arg id
 * @type number
 * @default 1
 * @text 丹方Id
 * @desc 丹方Id
 * 
 * @command openElixirScene
 * @text 打开炼丹界面
 * @desc 打开炼丹界面
 * 
 * @help
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_ElixirCore = true;

var Cat = Cat || {};
Cat.ElixirCore = {};
Cat.ElixirCore.parameters = PluginManager.parameters('Cat_ElixirCore');

PluginManager.registerCommand('Cat_ElixirCore', 'addElixirData', args => {
    const id = Number(args.id) - 1;
    const data = JsonEx.makeDeepCopy(ElixirData[id]);
    if (!$gameSystem._elixirData) {
        $gameSystem._elixirData = [];
    }
    if ($gameSystem._elixirData.filter(item => item.id == Number(args.id)).length == 0) {
        $gameSystem._elixirData.push(data);
    }
});

PluginManager.registerCommand('Cat_ElixirCore', 'openElixirScene', args => {
    SceneManager.push(Scene_ElixirCore);
});

Cat.ElixirCore.Sprite_Button_updateOpacity = Sprite_Button.prototype.updateOpacity;
Sprite_Button.prototype.updateOpacity = function () {
    if (this._buttonType == 'cancel' && SceneManager._scene instanceof Scene_ElixirCore) {
        this.opacity = 0;
    } else {
        Cat.ElixirCore.Sprite_Button_updateOpacity.call(this);
    }
};

Cat.ElixirCore.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
    Cat.ElixirCore.Game_Actor_initMembers.call(this);
    this._elixirData = {
        level: 0,
        nowExp: 0,
        value: 0,
        maxExp: 100
    };
};

Game_Actor.prototype.getMaxElixirData = function () {
    return this._elixirData;
};

Game_Actor.prototype.getMaxElixirExp = function () {
    return this._elixirData.level * 200 + 100;
};

function Scene_ElixirCore() {
    this.initialize(...arguments);
}

Scene_ElixirCore.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ElixirCore.prototype.constructor = Scene_ElixirCore;

Scene_ElixirCore.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    if (!$gameSystem._elixirData) {
        $gameSystem._elixirData = [];
    }
    this._ldState = 1;
    this._ldProgress = 0;
    this._success = false;
};

Cat.ElixirCore.Scene_ElixirCore_createBackground = Scene_ElixirCore.prototype.createBackground
Scene_ElixirCore.prototype.createBackground = function () {
    Cat.ElixirCore.Scene_ElixirCore_createBackground.call(this);
    this._backGroundSprites = new Sprite();
    this.addChild(this._backGroundSprites);
    this._backGroundSprites.bitmap = ImageManager.loadBitmap('img/newUi/ld/', 'back');
};

Scene_ElixirCore.prototype.createCancelButton = function () {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 70;
    this._cancelButton.y = this.buttonY() + 40;
    this.addWindow(this._cancelButton);
    this._cancelButton.scale.set(1.2);
};

Scene_ElixirCore.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    // this.createGoldLsWindow();
    this.createListWindow_X();
    this.createListWindow();
    this.createCommandWindow();
    this.createStatusWindow();
    this.createDlSprite();
    this.createProgressBarWindow();
    this.createRadioInfoWindow();
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._listWindow) this._listWindow._miniInfoWindow = this._miniWindow;
    };
    this.createTimeWindow();
    this.createGoldLsWindow();
};

Scene_ElixirCore.prototype.createRadioInfoWindow = function () {
    const rect = this.RadioInfoWindowRect();
    this._radioInfoWindow = new Window_ElixirRadioInfo(rect);
    this.addChild(this._radioInfoWindow);
    this._radioInfoWindow.hide();
};

Scene_ElixirCore.prototype.RadioInfoWindowRect = function () {
    const ww = 400;
    const wh = 60;
    const wx = Graphics.width / 2 - ww / 2 + 130;
    const wy = 200;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ElixirCore.prototype.createProgressBarWindow = function () {
    const rect = this.progressBarWindowRect();
    this._progressBarWindow = new Window_progressBar_X(rect);
    this.addWindow(this._progressBarWindow);
    this._progressBarWindow.hide();
};

Scene_ElixirCore.prototype.progressBarWindowRect = function () {
    const ww = 700;
    const wh = 80;
    const wx = 415;
    const wy = 580;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ElixirCore.prototype.createDlSprite = function () {
    this._playerSprite = new Sprite();
    this.addChild(this._playerSprite);
    this._playerSprite.bitmap = ImageManager.loadBitmap('img/newUi/ld/', 'ld' + this._ldState);
    this._playerSprite.x = 484;
    this._playerSprite.y = 156;
};

Scene_ElixirCore.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_ElixirStatus(rect);
    this.addChild(this._statusWindow);
};

Scene_ElixirCore.prototype.statusWindowRect = function () {
    const ww = 700;
    const wh = 500;
    const wx = 450;
    const wy = 80;
    return new Rectangle(wx, wy, ww, wh);
};


Scene_ElixirCore.prototype.createListWindow_X = function () {
    const rect = this.listTypeWindowRect();
    this._listTypeWindow = new Window_ElixirListType(rect);
    this._listTypeWindow.setHandler('ok', this.onListType.bind(this));
    this._listTypeWindow.setHandler('cancel', this.popScene.bind(this));
    this.addChild(this._listTypeWindow);
    this._listTypeWindow.activate();
    this._listTypeWindow.select(0);
};

Scene_ElixirCore.prototype.onListType = function () {
    this._listTypeWindow.deactivate();
    this._listTypeWindow.hide();
    this._listWindow.show();
    this._listWindow._loadingPictrue = false;
    this._listWindow.activate();
    this._listWindow.select(0);
};

Scene_ElixirCore.prototype.listTypeWindowRect = function () {
    const ww = 300;
    const wh = 516;
    const wx = 154;
    const wy = 110;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ElixirCore.prototype.createListWindow = function () {
    const rect = this.listWindowRect();
    this._listWindow = new Window_ElixirList(rect);
    this._listWindow.setHandler('ok', this.onList.bind(this));
    this._listWindow.setHandler('cancel', this.cancelList.bind(this));
    this.addChild(this._listWindow);
    this._listWindow.hide();
    this._listWindow.deactivate();
    this._listWindow.deselect();
};

Scene_ElixirCore.prototype.onList = function () {
    this._listWindow.deactivate();
    this._commandWindow.activate();
    this._commandWindow.select(0);
};

Scene_ElixirCore.prototype.cancelList = function () {
    this._listWindow.deactivate();
    this._listWindow.deselect();
    this._listWindow.hide();
    this._listTypeWindow.activate();
    this._listTypeWindow.show();
};

Scene_ElixirCore.prototype.listWindowRect = function () {
    const ww = 300;
    const wh = 516;
    const wx = 154;
    const wy = 110;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ElixirCore.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_ElixirCommand(rect);
    this._commandWindow.setHandler('ok', this.onCommand.bind(this));
    this._commandWindow.setHandler('cancel', this.cancelCommand.bind(this));
    this.addChild(this._commandWindow);
    this._commandWindow.deactivate();
    this._commandWindow.deselect();
};

Scene_ElixirCore.prototype.cancelCommand = function () {
    this._commandWindow.deactivate();
    this._commandWindow.deselect();
    this._listWindow.activate();
};

Scene_ElixirCore.prototype.onCommand = function () {
    if (!this._listWindow.item()) {
        SoundManager.playBuzzer();
        this._commandWindow.activate();
        return;
    }
    const data = this._listWindow.item();
    const actor = $gameParty.allMembers()[0];
    var itemList = data.item;
    for (let i = 0; i < itemList.length; i += 2) {
        if (itemList[i] > 0) {
            const id = itemList[i];
            const number = itemList[i + 1];
            const item = $dataItems[id];
            const nowNumber = $gameParty.numItems(item);
            if (nowNumber < number) {
                SoundManager.playBuzzer();
                this._commandWindow.activate();
                return;
            };
        };
    };
    var elixirData = actor.getMaxElixirData();
    var actorLevel = elixirData.level;
    var actorNowExp = elixirData.nowExp;
    var actorValue = elixirData.value;
    var maxExp = actor.getMaxElixirExp();

    var value = data.value;
    var exp = data.exp;
    var rate = data.rate + Math.floor(actorValue / 50);
    var complete = data.complete;
    var random = data.random;
    // console.log(random)
    this._completeItem = $dataItems[complete];
    this._completeItemNumber = Math.floor(Math.random() * random) + 1 + actorLevel;

    var randomNumber = Math.floor(Math.random() * 100) + 1;
    if (randomNumber <= rate) {
        this._success = true;
        actor._elixirData.value += value;
        actor._elixirData.nowExp += exp;
        while (actor._elixirData.nowExp >= maxExp) {
            actor._elixirData.nowExp = actor._elixirData.nowExp - maxExp;
            actor._elixirData.level++;
        }
        var maxExp = actor.getMaxElixirExp();
        actor._elixirData.maxExp = maxExp;
        $gameParty.gainItem(this._completeItem, this._completeItemNumber);
    } else {
        this._success = false;
    };
    for (let i = 0; i < itemList.length; i += 2) {
        if (itemList[i] > 0) {
            const id = itemList[i];
            const number = itemList[i + 1];
            const item = $dataItems[id];
            $gameParty.gainItem(item, -number)
        };
    };
    this._ldState = 2;
    this._ldProgress = 1;
    //this._goldLsWindow.refresh();
    this._progressBarWindow.refresh()
    this._progressBarWindow.open();
    this._progressBarWindow.show();
    this._progressBarWindow._startCount = 1;
};

Scene_ElixirCore.prototype.commandWindowRect = function () {
    const ww = 370;
    const wh = 80;
    const wx = 680 - 98;
    const wy = 366 + 162 + 18;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ElixirCore.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._playerSprite && this._ldState && this._lastImg != 'ld' + this._ldState) {
        this._playerSprite.bitmap = ImageManager.loadBitmap('img/newUi/ld/', 'ld' + this._ldState);
        this._lastImg = 'ld' + this._ldState;
    }
    if (this._listWindow && this._statusWindow && this._ldProgress == 0) {
        if (this._listWindow.item()) {
            this._data = this._listWindow.item();
            this._statusWindow.refresh(this._listWindow.item())
        }
    };
    // if (this._listTypeWindow) {
    //     if (this._listTypeWindow.item() == '恢复') {
    //         this._listWindow.set
    //     } else if (this._listTypeWindow.item() == '修炼') {

    //     } else {

    //     }
    // }
    if (this._listWindow && this._listWindow.item() && Imported.MiniInformationWindow) {
        const itemData = this._listWindow.item();
        const item = $dataItems[itemData.oldId];
        //this._listWindow._miniInfoWindow._showInfo = true;
        this._listWindow.setMiniWindow(item);
        this._listWindow._miniInfoWindow.show();
    }

    if (this._ldProgress == 2) {
        this._progressBarWindow.hide();
        if (this._success) {
            this._ldState = 3;
            SoundManager.playUseItem();
        } else {
            this._ldState = 4;
            SoundManager.playBuzzer();

        }
        this._radioInfoWindow.refresh();
        this._commandWindow.activate();
        this._ldProgress = 0;
    };
};

function Window_ElixirListType() {
    this.initialize(...arguments);
}

Window_ElixirListType.prototype = Object.create(Window_Selectable.prototype);
Window_ElixirListType.prototype.constructor = Window_ElixirListType;

Window_ElixirListType.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/ld/', 'listBack');
    this.createCursorSprite();
};

Window_ElixirListType.prototype.item = function () {
    return this._list[this.index()]
};

Window_ElixirListType.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];
    this._list = ElixirDataType;
    this.drawAllItems();
};

Window_ElixirListType.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 22;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(item, rect.x + 6, rect.y + 6, rect.width, 'center');
    }
};

Window_ElixirListType.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/ld/', 'cursor');;
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_ElixirListType.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    };
};

Window_ElixirListType.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        //    this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 6;
        this._cursorSprites.y = this._cursorSprite.y + 11;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_ElixirListType.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y - 6;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};


Window_ElixirListType.prototype.maxCols = function () {
    return 1;
};

Window_ElixirListType.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_ElixirListType.prototype.numVisibleRows = function () {
    return 8;
};

Window_ElixirListType.prototype.drawBackgroundRect = function (rect) {
};

Window_ElixirListType.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};

function Window_ElixirList() {
    this.initialize(...arguments);
}

Window_ElixirList.prototype = Object.create(Window_Selectable.prototype);
Window_ElixirList.prototype.constructor = Window_ElixirList;

Window_ElixirList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/ld/', 'listBack');
    this.createCursorSprite();
};

Window_ElixirList.prototype.item = function () {
    return this._list[this.index()]
};

Window_ElixirList.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];

    for (let s = 0; s < $gameSystem._elixirData.length; s++) {
        if ($gameSystem._elixirData[s]) {
            ElixirData.forEach(item => {
                if (item && item.id == $gameSystem._elixirData[s].id) {
                    $gameSystem._elixirData[s].type = item.type;
                }
            });
        };
    }
    this._list = $gameSystem._elixirData;
    let catElixirId = SceneManager._scene._listTypeWindow.index();
    this._list = this._list.filter(item => item.type == catElixirId);
    this.drawAllItems();
};

Window_ElixirList.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 22;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(($dataItems[item.complete] ? $dataItems[item.complete].name : item.name), rect.x + 6, rect.y + 6, rect.width, 'center');
    }
};

Window_ElixirList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/ld/', 'cursor');;
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_ElixirList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        if (SceneManager._scene._listTypeWindow && SceneManager._scene._listTypeWindow.item()) {
            this.refresh();
            this._loadingPictrue = true;
        };
    };
};

Window_ElixirList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        //    this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 6;
        this._cursorSprites.y = this._cursorSprite.y + 11;
    } else {
        this._cursorSprites.visible = false;
    }
    this._miniInfoWindow.x = 680;
    this._miniInfoWindow.y = 200;
};

Window_ElixirList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y - 6;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

Window_ElixirList.prototype.maxCols = function () {
    return 1;
};

Window_ElixirList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_ElixirList.prototype.numVisibleRows = function () {
    return 8;
};

Window_ElixirList.prototype.drawBackgroundRect = function (rect) {
};

Window_ElixirList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};


function Window_ElixirCommand() {
    this.initialize.apply(this, arguments);
}

Window_ElixirCommand.prototype = Object.create(Window_Command.prototype);
Window_ElixirCommand.prototype.constructor = Window_ElixirCommand;

Window_ElixirCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.createCursorSprite();
    this.refresh();
};

Window_ElixirCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/ld/', 'cursor');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_ElixirCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 26;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(this.commandName(index), rect.x + 8, rect.y, rect.width, align);
};

Window_ElixirCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        var ofx = -4;
        if (this.index() == 1) {
            var ofx = 20;
        }
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 68;
        this._cursorSprites.y = this._cursorSprite.y + 3;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_ElixirCommand.prototype.makeCommandList = function () {
    this.addCommand('开始炼丹', 'ok', true);
};

Window_ElixirCommand.prototype.maxItems = function () {
    return 1;
};

Window_ElixirCommand.prototype.numVisibleRows = function () {
    return 1;
};

Window_ElixirCommand.prototype.maxCols = function () {
    return 1;
};

Window_ElixirCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_ElixirCommand.prototype.drawBackgroundRect = function (rect) {
};

function Window_ElixirStatus() {
    this.initialize.apply(this, arguments);
}

Window_ElixirStatus.prototype = Object.create(Window_Base.prototype);
Window_ElixirStatus.prototype.constructor = Window_ElixirStatus;

Window_ElixirStatus.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_ElixirStatus.prototype.refresh = function (data) {
    this.createContents();
    const actor = $gameParty.allMembers()[0];
    const elixirData = actor.getMaxElixirData();
    this._actor = actor;
    this._data = data;
    this.contents.fontSize = 22;
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
    this.drawText('炼丹等级：' + elixirData.level, 15 + 20, 4, this.width, 'left');
    this.drawText('炼丹经验：' + elixirData.nowExp + '/' + elixirData.maxExp, 180 + 20, 4, this.width, 'left');
    this.drawText('炼丹熟练度：' + elixirData.value, 410 + 20, 4, this.width, 'left');

    var x = 0;
    var y = 370;
    this.contents.fontSize = 22;
    const itemList = data.item;
    for (let i = 0; i < itemList.length; i += 2) {
        if (itemList[i] > 0) {
            const id = itemList[i];
            const number = itemList[i + 1];
            const item = $dataItems[id];
            if (i == 0) {
                var x = 30 + 16;
                var y = 360;
            } else if (i == 2) {
                var x = 510 + 20;
                var y = 360;
            } else if (i == 4) {
                var x = 140 + 21;
                var y = 414;
            } else if (i == 6) {
                var x = 340 + 76;
                var y = 414;
            }
            this.drawIcon(item.iconIndex, x, y)
            this.drawText(item.name + '(' + $gameParty.numItems(item) + '/' + number + ')', x - 50, y - 40, 150, 'center');
        };
    };
};

Window_ElixirStatus.prototype.drawIcon = function (iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    const scw = pw * 1.5;
    const sch = ph * 1.5;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, scw, sch);
};

function Window_progressBar_X() {
    this.initialize(...arguments);
}

Window_progressBar_X.prototype = Object.create(Window_Base.prototype);
Window_progressBar_X.prototype.constructor = Window_progressBar_X;

Window_progressBar_X.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._startCount = 0;
    this._counts = 0;
    this._counts_1 = 0;
    this._counts_2 = 0;
    this.refresh();
};

Window_progressBar_X.prototype.refresh = function () {
    this.contentsBack.clear();
    this.contentsBack.strokeRect(20, 20, 650, 10, ColorManager.textColor(15))
};

Window_progressBar_X.prototype.refresh_1 = function () {
    this.contents.clear();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    const value = Math.floor(this._counts_1 / 648 * 100);
    this.contents.fontSize = 16;
    this.drawText(value + '%', 20, 6, 650, 'center');
};

Window_progressBar_X.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._startCount > 0) {
        this._counts++;
        if (this._counts == 1) {
            this._counts = 0;
            this._counts_1 += 4;
            this.refresh_1();
            this.contentsBack.gradientFillRect(21, 21, this._counts_1, 8, ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2());
            if (this._counts_1 == 648) {
                this._counts_1 = 0;
                this.contents.clear();
                this.contentsBack.clear();
                SceneManager._scene._ldProgress = 2;
                this._startCount = 0;
            }
        }
    }
};

function Window_ElixirRadioInfo() {
    this.initialize(...arguments);
}

Window_ElixirRadioInfo.prototype = Object.create(Window_Base.prototype);
Window_ElixirRadioInfo.prototype.constructor = Window_ElixirRadioInfo;

Window_ElixirRadioInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.counts = 120;
    this.windowskin = ImageManager.loadSystem("Window20");
};

Window_ElixirRadioInfo.prototype.refresh = function () {
    this.contents.clear();
    this.contents.fontSize = 20;
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
    this.show();
    const success = SceneManager._scene._success;
    const completeItem = SceneManager._scene._completeItem;
    const _completeItemNumber = SceneManager._scene._completeItemNumber;
    if (success) {
        this.drawText('你成功炼制' + completeItem.name + ' * ' + _completeItemNumber, 0, 0, this.width - 26, 'center');
    } else {
        this.drawText('炼制失败，材料全部损毁...', 0, 0, this.width - 26, 'center');
    }
};

Window_ElixirRadioInfo.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this.visible) {
        this.counts--;
        if (this.counts <= 0) {
            this.counts = 120
            this.contents.clear();
            this.visible = false;
        }
    };
};

