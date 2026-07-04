//=============================================================================
// RPG Maker MZ - SM
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<SM>
 * @author Cat
 * 
 * @param zText
 * @text 嘴内心描述
 * @type string[]
 * 
 * @param nText
 * @text 胸内心描述
 * @type string[]
 * 
 * @param pText
 * @text 后庭内心描述
 * @type string[]
 * 
 * @param xText
 * @text 穴内心描述
 * @type string[]
 * 
 * @param mouthValue
 * @text 嘴巴开发度系统变量选择
 * @desc 嘴巴开发度系统变量选择
 * @type variable
 * @default 22
 * 
 * @param thoraxValue
 * @text 胸部开发度系统变量选择
 * @desc 胸部开发度系统变量选择
 * @type variable
 * @default 23
 * 
 * @param vaginaValue
 * @text 小穴开发度系统变量选择
 * @desc 小穴开发度系统变量选择
 * @type variable
 * @default 24
 * 
 * @param bunsValue
 * @text 股开发度系统变量选择
 * @desc 股开发度系统变量选择
 * @type variable
 * @default 25
 * 
 * @param value_1
 * @text 与人类次数
 * @desc 与人类次数
 * @type variable
 * @default
 * 
 * @param value_2
 * @text 与怪物次数
 * @desc 与怪物次数
 * @type variable
 * @default
 * 
 * @param value_3
 * @text 被性骚扰次数
 * @desc 被性骚扰次数
 * @type variable
 * @default
 * 
 * @param value_4
 * @text 使用道具次数次数
 * @desc 使用道具次数次数
 * @type variable
 * @default
 * 
 * @param value_5
 * @text 强奸次数
 * @desc 强奸次数
 * @type variable
 * @default 32
 * 
 * @param value_6
 * @text 轮奸次数
 * @desc 轮奸次数
 * @type variable
 * @default 33
 * 
 * @param value_7
 * @text 引诱次数
 * @desc 引诱次数
 * @type variable
 * @default 
 * 
 * @param value_8
 * @text 强推次数
 * @desc 强推次数
 * @type variable
 * @default 
 * 
 * @param value_9
 * @text 口交次数
 * @desc 口交次数
 * @type variable
 * @default 
 * 
 * @param value_10
 * @text 乳交次数
 * @desc 乳交次数
 * @type variable
 * @default 
 * 
 * @param value_11
 * @text 肛交次数
 * @desc 肛交次数
 * @type variable
 * @default 
 * 
 * @help
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_SmCore = true;

var Cat = Cat || {};
Cat.SmCore = {};
Cat.SmCore.parameters = PluginManager.parameters('Cat_SmCore');
Cat.SmCore.zText = eval(Cat.SmCore.parameters['zText']) || [];
Cat.SmCore.nText = eval(Cat.SmCore.parameters['nText']) || [];
Cat.SmCore.pText = eval(Cat.SmCore.parameters['pText']) || [];
Cat.SmCore.xText = eval(Cat.SmCore.parameters['xText']) || [];
Cat.SmCore.mouthValue = Number(Cat.SmCore.parameters['mouthValue'] || 22);
Cat.SmCore.thoraxValue = Number(Cat.SmCore.parameters['thoraxValue'] || 23);
Cat.SmCore.vaginaValue = Number(Cat.SmCore.parameters['vaginaValue'] || 24);
Cat.SmCore.bunsValue = Number(Cat.SmCore.parameters['bunsValue'] || 25);
Cat.SmCore.value_1 = Number(Cat.SmCore.parameters['value_1']);
Cat.SmCore.value_2 = Number(Cat.SmCore.parameters['value_2']);
Cat.SmCore.value_3 = Number(Cat.SmCore.parameters['value_3']);
Cat.SmCore.value_4 = Number(Cat.SmCore.parameters['value_4']);
Cat.SmCore.value_5 = Number(Cat.SmCore.parameters['value_5']) || 32;
Cat.SmCore.value_6 = Number(Cat.SmCore.parameters['value_6']) || 33;
Cat.SmCore.value_7 = Number(Cat.SmCore.parameters['value_7']);
Cat.SmCore.value_8 = Number(Cat.SmCore.parameters['value_8']);
Cat.SmCore.value_9 = Number(Cat.SmCore.parameters['value_9']);
Cat.SmCore.value_10 = Number(Cat.SmCore.parameters['value_10']);
Cat.SmCore.value_11 = Number(Cat.SmCore.parameters['value_11']);

function Scene_SM() {
    this.initialize(...arguments);
}

Scene_SM.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SM.prototype.constructor = Scene_SM;

Scene_SM.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SM.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createInfoWindow();
    this.createSmSprite();
};

Scene_SM.prototype.createSmSprite = function () {
    this._smSprite_1 = new Sprite_Sm();
    this._smSprite_1.setId(1);
    this.addChild(this._smSprite_1);
    this._smSprite_1.x = 545;
    this._smSprite_1.y = 79;

    this._smSpriteText_1 = new Sprite_SmText();
    this._smSpriteText_1.setId(1);
    this.addChild(this._smSpriteText_1);
    this._smSpriteText_1.x = 545 - 1;
    this._smSpriteText_1.y = 79 + 130 - 2;

    this._smSprite_2 = new Sprite_Sm();
    this._smSprite_2.setId(2);
    this.addChild(this._smSprite_2);
    this._smSprite_2.x = 177;
    this._smSprite_2.y = 47;

    this._smSpriteText_2 = new Sprite_SmText();
    this._smSpriteText_2.setId(2);
    this.addChild(this._smSpriteText_2);
    this._smSpriteText_2.x = 177 - 1;
    this._smSpriteText_2.y = 47 + 130 - 2;

    this._smSprite_3 = new Sprite_Sm();
    this._smSprite_3.setId(3);
    this.addChild(this._smSprite_3);
    this._smSprite_3.x = 627;
    this._smSprite_3.y = 289;

    this._smSpriteText_3 = new Sprite_SmText();
    this._smSpriteText_3.setId(3);
    this.addChild(this._smSpriteText_3);
    this._smSpriteText_3.x = 627 - 1;
    this._smSpriteText_3.y = 289 + 130 - 2;

    this._smSprite_4 = new Sprite_Sm();
    this._smSprite_4.setId(4);
    this.addChild(this._smSprite_4);
    this._smSprite_4.x = 14;
    this._smSprite_4.y = 77;

    this._smSpriteText_4 = new Sprite_SmText();
    this._smSpriteText_4.setId(4);
    this.addChild(this._smSpriteText_4);
    this._smSpriteText_4.x = 14 - 1;
    this._smSpriteText_4.y = 77 + 130 - 2;

    this._actorSprite = new Sprite_SmImg();
    this.addChild(this._actorSprite);
};

Scene_SM.prototype.createInfoWindow = function () {
    const rect = this.infoWindowRect();
    const infoWindow = new Window_SmInfo(rect);
    this.addChild(infoWindow);
    this._infoWindow = infoWindow;
};

Scene_SM.prototype.infoWindowRect = function () {
    const wx = 800;
    const wy = 130;
    const ww = 390;
    const wh = 470;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_SM.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_SmCommand(rect);
    commandWindow.setHandler("ok", this.cancelSm.bind(this));
    commandWindow.setHandler("cancel", this.cancelSm.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow = commandWindow;
};

Scene_SM.prototype.cancelSm = function () {
    SceneManager.goto(Scene_Status)
};

Scene_SM.prototype.commandWindowRect = function () {
    const wx = 900;
    const wy = 500;
    const ww = 200;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

function Window_SmCommand() {
    this.initialize(...arguments);
}

Window_SmCommand.prototype = Object.create(Window_Command.prototype);
Window_SmCommand.prototype.constructor = Window_SmCommand;

Window_SmCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.openness = 0;
    this.createCursorSprite();
    this.open();
};

Window_SmCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/sm/', '光标1');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_SmCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor(); 1
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 26;
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_SmCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        //  this._cursorSprites.alpha = this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y + 12;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_SmCommand.prototype.makeCommandList = function () {
    this.addCommand('返回', "cancel");
};

Window_SmCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_SmCommand.prototype.numVisibleRows = function () {
    return 1;
};

Window_SmCommand.prototype.maxCols = function () {
    return 1;
};

Window_SmCommand.prototype.drawBackgroundRect = function (rect) {
};

function Window_SmInfo() {
    this.initialize(...arguments);
}

Window_SmInfo.prototype = Object.create(Window_Base.prototype);
Window_SmInfo.prototype.constructor = Window_SmInfo;

Window_SmInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._actor = $gameParty.allMembers()[0];
    this.refresh();
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
    var x = ofx;
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

Window_SmInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 20;//字体大小
    this.resetTextColor();
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.changeTextColor('#462a39');
};

Window_SmInfo.prototype.processColorChange = function (colorIndex) {
    if (colorIndex >= 0) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineWidth = 3;
    } else {
        this.contents.outlineWidth = 1;
    }
};


function Sprite_SmImg() {
    this.initialize(...arguments);
}

Sprite_SmImg.prototype = Object.create(Sprite.prototype);
Sprite_SmImg.prototype.constructor = Sprite_SmImg;

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
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', '立绘_1');
    }
    else if (level <= 2 && level2 <= 2 && level3 <= 2 && level4 <= 2) {
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', '立绘_2');
    }
    else if (level <= 3 && level2 <= 3 && level3 <= 3 && level4 <= 3) {
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', '立绘_3');
    }
    else if (level <= 4 && level2 <= 4 && level3 <= 4 && level4 <= 4) {
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', '立绘_4');
    }
    else if (level <= 5 && level2 <= 5 && level3 <= 5 && level4 <= 5) {
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', '立绘_5');
    }
};

Sprite_SmImg.prototype.getLevel = function (value) {
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

Sprite_SmImg.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._bitmaps && this._bitmaps.isReady() && !this._complete) {
        this.bitmap = this._bitmaps;
        this._complete = true;
    }
};

function Sprite_SmText() {
    this.initialize(...arguments);
}

Sprite_SmText.prototype = Object.create(Sprite.prototype);
Sprite_SmText.prototype.constructor = Sprite_SmText;

Sprite_SmText.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.createValueSprite();
};

Sprite_SmText.prototype.createValueSprite = function () {
    const bitmap = new Bitmap(144, 33);
    bitmap.fontSize = 22;
    bitmap.outlineWidth = 1;
    bitmap.textColor = '#462a39';
	bitmap.fontFace = $gameSystem.mainFontFace();
    bitmap.addLoadListener(this.onBitmapLoad.bind(this));
};

Sprite_SmText.prototype.onBitmapLoad = function (bitmap) {
    if (bitmap && bitmap.isReady()) {
        this.bitmap = bitmap;
    }
};

Sprite_SmText.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._id > 0 && this.bitmap && this.bitmap.isReady() && !this._complete) {
        const text = ['', '一阶段', '二阶段', '三阶段', '四阶段', '五阶段'];
        this.bitmap.drawText(text[this._level], 0, 0, 144, 33, "center");
        this._complete = true;
    }
};

Sprite_SmText.prototype.setId = function (id) {
    const mouthValue = $gameVariables.value(Cat.SmCore.mouthValue);
    const thoraxValue = $gameVariables.value(Cat.SmCore.thoraxValue);
    const vaginaValue = $gameVariables.value(Cat.SmCore.vaginaValue);
    const bunsValue = $gameVariables.value(Cat.SmCore.bunsValue);
    this._id = id;
    if (this._id == 1) {
        const level = this.getLevel(mouthValue);
        this._level = level;
    } else if (this._id == 2) {
        const level = this.getLevel(thoraxValue);
        this._level = level;
    } else if (this._id == 3) {
        const level = this.getLevel(vaginaValue);
        this._level = level;
    } else {
        const level = this.getLevel(bunsValue);
        this._level = level;
    }
};

Sprite_SmText.prototype.getLevel = function (value) {
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

function Sprite_Sm() {
    this.initialize(...arguments);
}

Sprite_Sm.prototype = Object.create(Sprite.prototype);
Sprite_Sm.prototype.constructor = Sprite_Sm;

Sprite_Sm.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.scale.y = 0.218;
    this.scale.x = 0.24;
    this._id = -1;
};

Sprite_Sm.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._id > 0 && this._bitmaps && this._bitmaps.isReady()) {
        this.bitmap = this._bitmaps;
    }
};

Sprite_Sm.prototype.setId = function (id) {
    const mouthValue = $gameVariables.value(Cat.SmCore.mouthValue);
    const thoraxValue = $gameVariables.value(Cat.SmCore.thoraxValue);
    const vaginaValue = $gameVariables.value(Cat.SmCore.vaginaValue);
    const bunsValue = $gameVariables.value(Cat.SmCore.bunsValue);
    this._id = id;
    if (this._id == 1) {
        const level = this.getLevel(mouthValue);
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', 'z_' + level);
        this._level = level;
    } else if (this._id == 2) {
        const level = this.getLevel(thoraxValue);
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', 'n_' + level);
        this._level = level;
    } else if (this._id == 3) {
        const level = this.getLevel(vaginaValue);
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', 'x_' + level);
        this._level = level;
    } else {
        const level = this.getLevel(bunsValue);
        this._bitmaps = ImageManager.loadBitmap('img/newUi/sm/', 'p_' + level);
        this._level = level;
    };
};

Sprite_Sm.prototype.getLevel = function (value) {
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

