//=============================================================================
// RPG Maker MZ - QTE变量条
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<QTE变量条>
 * @author Cat
 * 
 * @param back
 * @text 变量条背景
 * @desc 变量条背景
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param img
 * @text 变量条
 * @desc 变量条
 * @require 1
 * @dir img/system/
 * @type file
 * 
 * @param x
 * @text Qte位置偏移X
 * @type string
 * @default 0
 *
 * @param y
 * @text Qte位置偏移Y
 * @type string
 * @default 0
 * 
 * @param value
 * @text Qte次数变量
 * @desc Qte次数变量
 * @type variable
 * 
 * @command openQte
 * @text 启动
 * @desc 
 * 
 * @arg value
 * @type number
 * @text 设置按下次数
 * @desc 设置按下次数
 * @default1
 * 
 * @command stopQte
 * @text 停止
 * @desc 
 * 
 * @help
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_QtePicture = true;

var Cat = Cat || {};
Cat.QtePicture = {};
Cat.QtePicture.parameters = PluginManager.parameters('Cat_QtePicture');
Cat.QtePicture.x = Number(Cat.QtePicture.parameters['x'] || 500);
Cat.QtePicture.y = Number(Cat.QtePicture.parameters['y'] || 200);
Cat.QtePicture.value = Number(Cat.QtePicture.parameters['value'] || 0);
Cat.QtePicture.back = String(Cat.QtePicture.parameters['back']);
Cat.QtePicture.img = String(Cat.QtePicture.parameters['img']);

PluginManager.registerCommand('Cat_QtePicture', 'openQte', args => {
    const value = Number(args.value);
    SceneManager._scene._qteSprite.startQte(value);
});

PluginManager.registerCommand('Cat_QtePicture', 'stopQte', args => {
    SceneManager._scene._qteSprite.stopQte();
});

Cat.QtePicture.Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function () {
    Cat.QtePicture.Scene_Battle_createAllWindows.call(this);
    this.createQteSprite();
};

Cat.QtePicture.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
    Cat.QtePicture.Scene_Map_createAllWindows.call(this);
    this.createQteSprite();
};

Scene_Base.prototype.createQteSprite = function () {
    this._qteSprite = new Sprite_QteUi();
    this.addChild(this._qteSprite);
    this._qteSprite.visible = false;
};

function Sprite_QteUi() {
    this.initialize(...arguments);
}

Sprite_QteUi.prototype = Object.create(Sprite.prototype);
Sprite_QteUi.prototype.constructor = Sprite_QteUi;

Sprite_QteUi.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

Sprite_QteUi.prototype.initMembers = function () {
    this.x = Cat.QtePicture.x;
    this.y = Cat.QtePicture.y;
    this._start = false;
    this.bitmap = ImageManager.loadBitmap('img/system/', Cat.QtePicture.back);
    this.createValueGauge();
    this._valueSprite = new Sprite();
    this.addChild(this._valueSprite);
};

Sprite_QteUi.prototype.createValueGauge = function () {
    this._imgSprite = new Sprite();
    this.addChild(this._imgSprite);
    this._imgSprite.bitmap = ImageManager.loadBitmap('img/system/', Cat.QtePicture.img);
    this._imgSprite.setFrame(0, 0, 0, 0);
};

Sprite_QteUi.prototype.startQte = function (value) {
    this._maxValue = value;
    this._valueBitmap = new Bitmap(this.width, this.height);
    this._valueBitmap.addLoadListener(this.setValueBitmap.bind(this));
    this._imgSprite.setFrame(0, 0, 0, 0);
    this._start = true;
};

Sprite_QteUi.prototype.setValueBitmap = function (bitmap) {
    if (bitmap && bitmap.isReady()) {
        this.setupValueBitmapFont();
        const nowValue = $gameVariables.value(Number(Cat.QtePicture.value));
        const text = '已点击次数' + nowValue + '/' + this._maxValue;
        this._valueBitmap.drawText(text, 0, 0, bitmap.width, 30, "center");
    };
    this._valueSprite.bitmap = this._valueBitmap;
    this._valueSprite.y = 30;
}

Sprite_QteUi.prototype.setupValueBitmapFont = function () {
    this._valueBitmap.fontFace = $gameSystem.mainFontFace();
    this._valueBitmap.fontSize = 30;
    this._valueBitmap.textColor = ColorManager.textColor(0);
    this._valueBitmap.outlineColor = ColorManager.outlineColor();
    this._valueBitmap.outlineWidth = 3;
};

Sprite_QteUi.prototype.stopQte = function () {
    this._start = false;
    this._imgSprite.setFrame(0, 0, 0, 0);
    this.visible = false;
};

Sprite_QteUi.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._start && this._imgSprite && this._imgSprite.bitmap) {
        const width = this._imgSprite.bitmap.width;
        const height = this._imgSprite.bitmap.height;
        const value = $gameVariables.value(Number(Cat.QtePicture.value));
        const rate = value / this._maxValue;
        this._imgSprite.setFrame(0, 0, Math.floor(width * rate), height);
        if (this._valueBitmap) {
            this._valueBitmap.clear();
            const text = '已点击次数' + value + '/' + this._maxValue;
            this._valueBitmap.drawText(text, 0, 0, this._valueBitmap.width, 30, "center");
        }
        this.visible = true;
    }
};