//=============================================================================
// RPG Maker MZ - 心法核心
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<心法核心>
 * @author FlyCat
 * 
 * @param wxVariable
 * @text 悟性变量
 * @type variable
 * @default 0
 * 
 * @param data
 * @type struct<HeartData>[]
 * @default
 * @text 心法设置
 * @desc 心法设置
 * 
 * @command openHearData
 * @text 添加指定心法
 * @desc 添加指定心法
 *
 * @arg Id
 * @type number
 * @default 1
 * @text 心法Id
 * @desc 心法Id
 * 
 * @command openHearScene
 * @text 打开心法界面
 * @desc 打开心法界面
 * 
 * @help
 */

/*~struct~HeartData:
@param name
@text 心法名字
@type string
@default

@param heartPicture
@text 心法图
@require 1
@dir img/menu/
@type file

@param animation
@text 特效图
@require 1
@dir img/menu/
@type file

@param aniCounst
@text 特效帧数
@type number
@default 30

@param maxLevel
@text 最大等级
@type number
@default

@param wx
@text 每级增加悟性
@type number[]
@default [0,0,0,0,0,0,0,0]

@param skill
@text 每级学会技能
@type skill[]
@default [0,0,0,0,0,0,0,0]

@param exp
@text 每级消耗月份
@type number[]
@default

@param gold
@text 每级消耗灵石
@type number[]
@default 

@param param
@text 每级增加属性
@type struct<ParamData>[]
@default
*/
/*~struct~ParamData:
@param param
@text 属性设置
@desc 攻击 防御 魔法攻击 魔法防御 速度 运气 最大生命 最大灵力
@type number[]
@default [0,0,0,0,0,0,0,0]
*/
'use strict';
var Imported = Imported || {};
Imported.Cat_HeartCore = true;

var Cat = Cat || {};
Cat.HeartCore = {};
Cat.HeartCore.parameters = PluginManager.parameters('Cat_HeartCore');
Cat.HeartCore.data = JSON.parse(Cat.HeartCore.parameters['data'] || '[]');
Cat.HeartCore.wxVariable = Number(Cat.HeartCore.parameters['wxVariable']);

if (Cat.HeartCore.data) {
    const length = Cat.HeartCore.data.length;
    for (let i = 0; i < length; i++) {
        if (Cat.HeartCore.data[i]) {
            Cat.HeartCore.data[i] = JSON.parse(Cat.HeartCore.data[i]);
            Cat.HeartCore.data[i].exp = JSON.parse(Cat.HeartCore.data[i].exp);
            Cat.HeartCore.data[i].gold = JSON.parse(Cat.HeartCore.data[i].gold);
            Cat.HeartCore.data[i].maxLevel = JSON.parse(Cat.HeartCore.data[i].maxLevel);
            Cat.HeartCore.data[i].wx = JSON.parse(Cat.HeartCore.data[i].wx);
            Cat.HeartCore.data[i].skill = JSON.parse(Cat.HeartCore.data[i].skill);
            Cat.HeartCore.data[i].param = JSON.parse(Cat.HeartCore.data[i].param);
            if (Cat.HeartCore.data[i].param) {
                for (let s = 0; s < Cat.HeartCore.data[i].param.length; s++) {
                    Cat.HeartCore.data[i].param[s] = JSON.parse(Cat.HeartCore.data[i].param[s]);
                    Cat.HeartCore.data[i].param[s].param = JSON.parse(Cat.HeartCore.data[i].param[s].param);
                }
            }
        }
    }
    //console.log(Cat.HeartCore.data)
};

PluginManager.registerCommand('Cat_HeartCore', 'openHearData', args => {
    const id = Number(args.Id) - 1;
    const data = JsonEx.makeDeepCopy(Cat.HeartCore.data[id]);
    data._level = 0;
    data._id = id;
    if (!$gameSystem._heartData) {
        $gameSystem._heartData = [];
    }
    if ($gameSystem._heartData.filter(item => item._id == id).length == 0) {
        $gameSystem._heartData.push(data);
    }
});

PluginManager.registerCommand('Cat_HeartCore', 'openHearScene', args => {
    SceneManager.push(Scene_HeartCore);
});

Cat.HeartCore.Sprite_Button_updateOpacity = Sprite_Button.prototype.updateOpacity;
Sprite_Button.prototype.updateOpacity = function () {
    if (this._buttonType == 'cancel' && SceneManager._scene instanceof Scene_HeartCore) {
        this.opacity = 0;
    } else {
        Cat.HeartCore.Sprite_Button_updateOpacity.call(this);
    }
};

function Scene_HeartCore() {
    this.initialize(...arguments);
}

Scene_HeartCore.prototype = Object.create(Scene_MenuBase.prototype);
Scene_HeartCore.prototype.constructor = Scene_HeartCore;

Scene_HeartCore.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    if (!$gameSystem._heartData) {
        $gameSystem._heartData = [];
    }
    this._data = null;
    // this._heartId = $gameTemp._hearDataId;
    // this._data = Cat.HeartCore.data[this._heartId];
    // if (!$gameSystem._heartData) {
    //     $gameSystem._heartData = [];
    // }
    // if (!$gameSystem._heartData[this._heartId]) {
    //     $gameSystem._heartData[this._heartId] = this._data;
    //     $gameSystem._heartData[this._heartId]._level = 0;
    // }
};

Cat.HeartCore.Scene_HeartCore_createBackground = Scene_HeartCore.prototype.createBackground
Scene_HeartCore.prototype.createBackground = function () {
    Cat.HeartCore.Scene_HeartCore_createBackground.call(this);
    this._backGroundSprites = new Sprite();
    this.addChild(this._backGroundSprites);
    this._backGroundSprites.bitmap = ImageManager.loadBitmap('img/newUi/xf/', '底板');
};

Scene_HeartCore.prototype.createCancelButton = function () {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 70;
    this._cancelButton.y = this.buttonY() + 40;
    this.addWindow(this._cancelButton);
    this._cancelButton.scale.set(1.2);
};

Scene_HeartCore.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createGoldLsWindow();
    this.createListWindow();
    this.createCommandWindow();
    this.createStatusWindow();
    this.createPlayerSprite();
    this.createAnimationSprite();
};

Scene_HeartCore.prototype.createListWindow = function () {
    const rect = this.listWindowRect();
    this._listWindow = new Window_HeartList(rect);
    this._listWindow.setHandler('ok', this.onList.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this.addChild(this._listWindow);
    this._listWindow.activate();
    this._listWindow.select(0);
};

Scene_HeartCore.prototype.onList = function () {
    this._listWindow.deactivate();
    this._commandWindow.activate();
};

Scene_HeartCore.prototype.listWindowRect = function () {
    const ww = 270;
    const wh = 516;
    const wx = 166;
    const wy = 110;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_HeartCore.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_HeartStatus(rect);
    this.addChild(this._statusWindow);
};

Scene_HeartCore.prototype.statusWindowRect = function () {
    const ww = 658;
    const wh = 480;
    const wx = 448;
    const wy = 108;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_HeartCore.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_HeartCommand(rect);
    this._commandWindow.setHandler('ok', this.onCommand.bind(this));
    this._commandWindow.setHandler('cancel', this.cancelCommand.bind(this));
    this.addChild(this._commandWindow);
    this._commandWindow.deactivate();
    // this.createCommandSprite();
};

Scene_HeartCore.prototype.createCommandSprite = function () {
    this._heartButtonSprite = new Sprite_HeartCommandButton();
    this.addChild(this._heartButtonSprite);
    this._heartButtonSprite._buttonId = 0;
    this._heartButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', "心法按钮")
    this._heartButtonSprite.x = 190;
    this._heartButtonSprite.y = 569;
};

Scene_HeartCore.prototype.cancelCommand = function () {
    this._commandWindow.deactivate();
    this._listWindow.activate();
};

Scene_HeartCore.prototype.onCommand = function () {
    const actor = $gameParty.allMembers()[0];
    if (!this._data) {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
    const data = this._data;
    const exp = data.exp;
    const param = data.param;
    const gold = data.gold;
    if (data._level >= data.maxLevel) {
        SoundManager.playBuzzer();
        this._commandWindow.activate();
        return;
    }
    const month = Number(exp[data._level]);
    const levelParam = param[data._level];
    const upParam = levelParam.param;
    var golds = Number(gold[data._level]);
    var goldItem = $dataItems[FlyCat.LL_SceneMenu.goldItem]
    var goldItemNumber = $gameParty.numItems(goldItem);
    if (goldItemNumber >= golds) {
        $gameParty.loseItem(goldItem, golds);
        for (let i = 0; i < 8; i++) {
            const value = Number(upParam[i]);
            if (value > 0) {
                if (i == 6) {
                    actor.addParam(0, value);
                } else if (i == 7) {
                    actor.addParam(1, value);
                } else {
                    actor.addParam(i + 2, value);
                }
            }
        };
        var nowMonth = $gameVariables.value(3) + month;
        var addYeat = 0;
        while (nowMonth > 12) {
            nowMonth -= 12;
            addYeat++;
        }
        $gameVariables.setValue(3, nowMonth);
        $gameVariables.setValue(2, $gameVariables.value(2) + addYeat);

        var wx = Number(data.wx[data._level]);
        $gameVariables.setValue(Cat.HeartCore.wxVariable, $gameVariables.value(Cat.HeartCore.wxVariable) + wx);

        const skillId = data.skill[data._level];
        if (skillId > 0) {
            actor.learnSkill(skillId);
        }

        data._level += 1;
        SoundManager.playRecovery();
        this._goldLsWindow.refresh();
        this._statusWindow.refresh(data);
        this._commandWindow.activate();
    } else {
        SoundManager.playBuzzer();
        this._commandWindow.activate();
        return;
    }
};

Scene_HeartCore.prototype.commandWindowRect = function () {
    const ww = 250;
    const wh = 60;
    const wx = 600;
    const wy = 570;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_HeartCore.prototype.createPlayerSprite = function () {
    // const img = this._data.heartPicture;
    // this._heartBackSprite = new Sprite();
    // this.addChild(this._heartBackSprite);
    // this._heartBackSprite.anchor.set(0.5);
    // this._heartBackSprite.x = 750;
    // this._heartBackSprite.y = 350;
    //this._heartBackSprite.bitmap = ImageManager.loadBitmap('img/menu/', img);
    this._playerSprite = new Sprite();
    this.addChild(this._playerSprite);
    this._playerSprite.bitmap = ImageManager.loadBitmap('img/newUi/xf/', '修炼动画2');
    this._playerSprite.x = 449;
    this._playerSprite.y = 177;
};

Scene_HeartCore.prototype.createAnimationSprite = function () {
    this._counts = 0;
    this._playAniCounts = 0;
    this._playAniCounts_1 = 0;
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.visible = false;
    this._cursorSprites.setFrame(0, 0, 192, 192);
    this._cursorSprites.anchor.set(0.5);
    this._cursorSprites.x = 776;
    this._cursorSprites.y = 310;
};

Scene_HeartCore.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._listWindow && this._statusWindow) {
        if (this._listWindow.item()) {
            this._data = this._listWindow.item();
            this._statusWindow.refresh(this._listWindow.item())
            this._maxCounts = Number(this._listWindow.item().aniCounst)
            const img = this._listWindow.item().animation;
            if (!this._cursorSprites.bitmap || this._lastAni != img) {
                this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', img);
                this._cursorSprites.setFrame(0, 0, 192, 192);
                this._lastAni = img;
            }
            if (this._cursorSprites) {
                this._counts++;
                if (this._counts >= 4) {
                    this._cursorSprites.visible = true;
                    this._cursorSprites.setFrame(192 * this._playAniCounts, this._playAniCounts_1 * 192, 192, 192);
                    this._playAniCounts++;
                    if (this._playAniCounts > 4) {
                        this._playAniCounts_1++;
                        if (this._playAniCounts_1 > (this._maxCounts / 5)) {
                            this._playAniCounts_1 = 0;
                        }
                        this._playAniCounts = 0;
                    }
                    this._counts = 0;
                }
            };
        }
    }
};

function Window_HeartStatus() {
    this.initialize.apply(this, arguments);
}

Window_HeartStatus.prototype = Object.create(Window_Base.prototype);
Window_HeartStatus.prototype.constructor = Window_HeartStatus;

Window_HeartStatus.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_HeartStatus.prototype.refresh = function (data) {
    this.createContents();
    const actor = $gameParty.allMembers()[0];
    this._actor = actor;
    this._data = data;
    const exp = data.exp;
    const name = data.name;
    const param = data.param;
    const level = data._level;
    const gold = data.gold;

    this.contents.fontSize = 26;
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
    this.drawText('名称：' + name + '  等级：' + level, 0, 0, this.width - 26 - 10, 'center');

    this.contents.fontSize = 20;
    //const width = 200;
    var month = '';
    var golds = 0;
    this._upParam = [];

    if (level < data.maxLevel) {
        var month = Number(exp[level]);
        var levelParam = param[level];
        var upParam = levelParam.param;
        this._upParam = upParam;
        var golds = Number(gold[level]);
        var text = '';
        var goldItem = $dataItems[FlyCat.LL_SceneMenu.goldItem]
        var goldItemNumber = $gameParty.numItems(goldItem);
        this.drawText('消耗：' + month + '个月' + '  ' + golds + '灵石' + '(' + goldItemNumber + ')', 0, 359, this.width, 'left');
        for (let i = 0; i < 8; i++) {
            if (this._upParam[i] && this._upParam[i] > 0) {

                if (i == 6) {
                    text += TextManager.params(0)
                    var value = this._upParam[6];
                } else if (i == 7) {
                    text += TextManager.params(1)
                    var value = this._upParam[7];
                } else {
                    text += TextManager.params(i + 2)
                    var value = this._upParam[i];
                }
                text += value
                text += ' '
            };
        };
        this.drawText('属性收益：' + text, 0, 389, this.width, 'left');
        var text = '';
        const wx = data.wx[level];
        const skillId = data.skill[level];
        if (wx > 0) {
            text += ('悟性+' + wx + '  ')
        }
        if (skillId > 0) {
            text += ('领悟技能：' + $dataSkills[skillId].name)
        }
        this.drawText('额外收益：' + text, 0, 419, this.width, 'left');
    }
    // this.drawAllParams(x, y + ofy * 5 + 3);
};

Window_HeartStatus.prototype.drawAllParams = function (x, y) {
    for (let i = 0; i < 6; i++) {
        this.drawItem(x, y + i * 35, 2 + i);
    };
};

Window_HeartStatus.prototype.drawItem = function (x, y, paramId) {
    const paramWidth = 200;
    this.changeTextColor('#4e7574');
    this.contents.outlineColor = '#5a8f9e';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 20;
    this.drawText(TextManager.params(paramId), x, y, paramWidth, "left");
    this.contents.outlineWidth = 0;
    this.drawText(this._actor.param(paramId), x, y, paramWidth + 50, "center");
    if (this._data._level < this._data.maxLevel) {
        this.drawNewParam(x + 120, y, paramId, paramWidth);
    }
};

Window_HeartStatus.prototype.drawNewParam = function (x, y, paramId, paramWidth) {
    const newValue = this._actor.param(paramId) + Number(this._upParam[paramId - 2]);
    const diffvalue = newValue - this._actor.param(paramId);
    this.changeTextColor(ColorManager.newParamchangeTextColor(diffvalue));
    this.drawText(newValue, x, y, paramWidth, "center");
};

TextManager.params = function (paramId) {
    switch (paramId) {
        case 0:
            return '生命力'
        case 1:
            return '灵力'
        case 2:
            return '攻击';
        case 3:
            return '防御';
        case 4:
            return '法攻';
        case 5:
            return '法防';
        case 6:
            return '身法';
        case 7:
            return '气运';
    }
};

function Window_HeartCommand() {
    this.initialize.apply(this, arguments);
}

Window_HeartCommand.prototype = Object.create(Window_Command.prototype);
Window_HeartCommand.prototype.constructor = Window_HeartCommand;

Window_HeartCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.createCursorSprite();
    this.refresh();
};

Window_HeartCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/xf/', '光标');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_HeartCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 26;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(this.commandName(index), rect.x + 16, rect.y, rect.width, align);
};

Window_HeartCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        //    this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 6;
        this._cursorSprites.y = this._cursorSprite.y - 8;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_HeartCommand.prototype.makeCommandList = function () {
    this.addCommand('修习', 'ok', true);
    this.addCommand('返回', 'cancel', true);
};

Window_HeartCommand.prototype.maxItems = function () {
    return 2;
};

Window_HeartCommand.prototype.numVisibleRows = function () {
    return 1;
};

Window_HeartCommand.prototype.maxCols = function () {
    return 2;
};

Window_HeartCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_HeartCommand.prototype.drawBackgroundRect = function (rect) {
};

function Sprite_HeartCommandButton() {
    this.initialize(...arguments);
}

Sprite_HeartCommandButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_HeartCommandButton.prototype.constructor = Sprite_HeartCommandButton;

Sprite_HeartCommandButton.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._counts = 0;
    this._buttonId = -1;
};

Sprite_HeartCommandButton.prototype.onClick = function () {
    if (SceneManager._scene._commandWindow.active) {
        SceneManager._scene._commandWindow.select(this._buttonId);
        SceneManager._scene._commandWindow.processOk();
    } else {
        SoundManager.playBuzzer();
    }
};

Sprite_HeartCommandButton.prototype.onMouseEnter = function () {
    if (SceneManager._scene._commandWindow.active) {
        SceneManager._scene._commandWindow.select(this._buttonId);
        SoundManager.playCursor();
        this._colorTone = [50, 50, 50, 0]
        this._updateColorFilter();
        this._counts = 2;
        this.opacity = 255;
    };
};

Sprite_HeartCommandButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    const index = SceneManager._scene._commandWindow.index();
    if (index >= 0 && this._buttonId == index && this._counts != 2) {
        if (this.opacity <= 50) {
            this._counts = 1;
        }
        if (this.opacity >= 255) {
            this._counts = 0;
        }
        if (this._counts == 0) {
            this.opacity -= 5;
        }
        if (this._counts == 1) {
            this.opacity += 5;
        }
    } else {
        this._colorTone = [0, 0, 0, 0]
        this._updateColorFilter();
    }
};

Sprite_HeartCommandButton.prototype.onMouseExit = function () {
    this._colorTone = [0, 0, 0, 0]
    this._updateColorFilter();
    this._counts = 0;
};

Sprite_HeartCommandButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};

function Window_HeartList() {
    this.initialize(...arguments);
}

Window_HeartList.prototype = Object.create(Window_Selectable.prototype);
Window_HeartList.prototype.constructor = Window_HeartList;

Window_HeartList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/xf/', '条框');
    this.createCursorSprite();
};

Window_HeartList.prototype.item = function () {
    return this._list[this.index()]
};

Window_HeartList.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];
    this._list = $gameSystem._heartData;
    this.drawAllItems();
};

Window_HeartList.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 28;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(item.name, rect.x, rect.y + 6, rect.width, 'center');
    }
};

Window_HeartList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/xf/', '光标');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_HeartList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    };
};

Window_HeartList.prototype._updateCursor = function () {
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

Window_HeartList.prototype.drawCursorBitmap = function (rect) {
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

Window_HeartList.prototype.maxCols = function () {
    return 1;
};

Window_HeartList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_HeartList.prototype.numVisibleRows = function () {
    return 8;
};

Window_HeartList.prototype.drawBackgroundRect = function (rect) {
};

Window_HeartList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};